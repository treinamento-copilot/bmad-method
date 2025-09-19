/**
 * @fileoverview Modelo de dados do Evento
 * @author Dev Agent James
 */

const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

/**
 * Schema do Event com validações completas
 */
const eventSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => randomUUID()
  },
  name: { 
    type: String, 
    required: [true, 'Nome do evento é obrigatório'], 
    trim: true, 
    maxLength: [100, 'Nome do evento deve ter no máximo 100 caracteres'],
    minLength: [3, 'Nome do evento deve ter pelo menos 3 caracteres']
  },
  date: { 
    type: Date, 
    required: [true, 'Data do evento é obrigatória'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Data do evento deve ser no futuro'
    }
  },
  location: { 
    type: String, 
    required: [true, 'Local do evento é obrigatório'], 
    trim: true, 
    maxLength: [200, 'Local do evento deve ter no máximo 200 caracteres'],
    minLength: [5, 'Local do evento deve ter pelo menos 5 caracteres']
  },
  organizerId: { 
    type: String, 
    required: [true, 'ID do organizador é obrigatório'], 
    default: () => randomUUID()
  },
  status: { 
    type: String, 
    enum: {
      values: ['draft', 'active', 'completed', 'cancelled'],
      message: 'Status deve ser: draft, active, completed ou cancelled'
    }, 
    default: 'draft'
  },
  confirmationDeadline: { 
    type: Date, 
    required: false,
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        return value > new Date() && value < this.date;
      },
      message: 'Deadline de confirmação deve ser no futuro e antes da data do evento'
    }
  },
  estimatedParticipants: { 
    type: Number, 
    required: [true, 'Número estimado de participantes é obrigatório'], 
    min: [1, 'Deve ter pelo menos 1 participante'],
    max: [50, 'Máximo de 50 participantes permitido'],
    validate: {
      validator: Number.isInteger,
      message: 'Número de participantes deve ser um número inteiro'
    }
  }
}, { 
  timestamps: true,
  collection: 'events',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Índices para performance
 */
eventSchema.index({ organizerId: 1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ status: 1, date: 1 });

/**
 * Virtual para calcular days until event
 */
eventSchema.virtual('daysUntilEvent').get(function() {
  if (!this.date) return null;
  const diffTime = this.date.getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

/**
 * Virtual para verificar se confirmations estão abertas
 */
eventSchema.virtual('isConfirmationOpen').get(function() {
  if (!this.confirmationDeadline) return true;
  return new Date() < this.confirmationDeadline;
});

/**
 * Método estático para buscar por ID público
 * @param {string} publicId - ID público do evento
 * @returns {Promise<Event|null>}
 */
eventSchema.statics.findByPublicId = function(publicId) {
  return this.findOne({ id: publicId });
};

/**
 * Método estático para criar evento com validação
 * @param {Object} eventData - Dados do evento
 * @returns {Promise<Event>}
 */
eventSchema.statics.createEvent = async function(eventData) {
  const event = new this(eventData);
  return await event.save();
};

/**
 * Método estático para atualizar por ID público
 * @param {string} publicId - ID público do evento
 * @param {Object} updateData - Dados para atualização
 * @returns {Promise<Event|null>}
 */
eventSchema.statics.updateByPublicId = function(publicId, updateData) {
  // Remove campos que não devem ser atualizados diretamente
  const { id, _id, createdAt, ...safeUpdateData } = updateData;
  
  return this.findOneAndUpdate(
    { id: publicId }, 
    { ...safeUpdateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

/**
 * Método estático para soft delete por ID público
 * 
 * Este método realiza um soft delete, alterando o status do evento para 'cancelled'
 * ao invés de remover fisicamente o documento do banco de dados.
 * 
 * @param {string} publicId - ID público do evento
 * @returns {Promise<Event|null>}
 */
eventSchema.statics.deleteByPublicId = function(publicId) {
  return this.findOneAndUpdate(
    { id: publicId },
    { status: 'cancelled', updatedAt: new Date() },
    { new: true }
  );
};

/**
 * Método estático para buscar evento com relações
 * @param {string} publicId - ID público do evento
 * @returns {Promise<Object>}
 */
eventSchema.statics.findWithRelations = async function(publicId) {
  const mongoose = require('mongoose');
  const Guest = mongoose.model('Guest');
  const EventItem = mongoose.model('EventItem');
  
  const event = await this.findByPublicId(publicId);
  if (!event) return null;
  
  const [guests, items] = await Promise.all([
    Guest.find({ eventId: publicId }),
    EventItem.find({ eventId: publicId })
  ]);
  
  return {
    ...event.toObject(),
    guests,
    items,
    guestCount: guests.length,
    confirmedGuestCount: guests.filter(g => g.rsvpStatus === 'yes').length
  };
};

/**
 * Método de instância para verificar se pode ser editado
 */
eventSchema.methods.canBeEdited = function() {
  return this.status === 'draft' || (this.status === 'active' && this.daysUntilEvent > 0);
};

/**
 * Método de instância para verificar se pode ser cancelado
 */
eventSchema.methods.canBeCancelled = function() {
  return ['draft', 'active'].includes(this.status) && this.daysUntilEvent > 0;
};

/**
 * Pre-save middleware para validações customizadas
 */
eventSchema.pre('save', function(next) {
  // Garantir que confirmationDeadline não seja depois da data do evento
  if (this.confirmationDeadline && this.date && this.confirmationDeadline >= this.date) {
    const error = new Error('Deadline de confirmação deve ser antes da data do evento');
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
});

/**
 * Post-save middleware para logging
 */
eventSchema.post('save', function(doc) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`✅ Evento salvo: ${doc.name} (${doc.id})`);
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;