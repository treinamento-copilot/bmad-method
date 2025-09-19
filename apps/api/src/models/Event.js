const mongoose = require('mongoose');
const { generateUniqueId } = require('../utils/database');

/**
 * @fileoverview Event Model - Schema para eventos do ChurrasApp
 * Implementa schema detalhado conforme especificação da arquitetura
 */

const eventSchema = new mongoose.Schema({
  // ID público único (UUID v4)
  id: {
    type: String,
    required: true,
    unique: true,
    default: generateUniqueId,
    index: true
  },
  
  // Nome do evento
  name: {
    type: String,
    required: [true, 'Nome do evento é obrigatório'],
    trim: true,
    maxLength: [100, 'Nome não pode exceder 100 caracteres'],
    minLength: [3, 'Nome deve ter pelo menos 3 caracteres']
  },
  
  // Data do evento
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
  
  // Local do evento
  location: {
    type: String,
    required: [true, 'Local do evento é obrigatório'],
    trim: true,
    maxLength: [200, 'Local não pode exceder 200 caracteres'],
    minLength: [5, 'Local deve ter pelo menos 5 caracteres']
  },
  
  // ID do organizador (UUID v4)
  organizerId: {
    type: String,
    required: [true, 'ID do organizador é obrigatório'],
    default: generateUniqueId,
    index: true
  },
  
  // Status do evento
  status: {
    type: String,
    enum: {
      values: ['draft', 'active', 'completed', 'cancelled'],
      message: 'Status deve ser: draft, active, completed ou cancelled'
    },
    default: 'draft',
    index: true
  },
  
  // Prazo para confirmação de presença
  confirmationDeadline: {
    type: Date,
    required: false,
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        return value <= this.date;
      },
      message: 'Prazo de confirmação deve ser antes da data do evento'
    }
  },
  
  // Número estimado de participantes
  estimatedParticipants: {
    type: Number,
    required: [true, 'Número estimado de participantes é obrigatório'],
    min: [1, 'Deve haver pelo menos 1 participante'],
    max: [50, 'Número máximo de participantes é 50'],
    validate: {
      validator: Number.isInteger,
      message: 'Número de participantes deve ser um número inteiro'
    }
  }
}, {
  // Timestamps automáticos (createdAt, updatedAt)
  timestamps: true,
  
  // Configurações do schema
  collection: 'events',
  versionKey: false,
  
  // Transform para JSON (remove _id, mantém apenas id público)
  toJSON: {
    transform: function(doc, ret) {
      delete ret._id;
      return ret;
    }
  },
  
  // Transform para Object
  toObject: {
    transform: function(doc, ret) {
      delete ret._id;
      return ret;
    }
  }
});

/**
 * Índices otimizados para consultas frequentes
 */

// Índice único para ID público
eventSchema.index({ id: 1 }, { unique: true });

// Índice para organizador (consultas por usuário)
eventSchema.index({ organizerId: 1 });

// Índice para status (filtros por status)
eventSchema.index({ status: 1 });

// Índice temporal para ordenação por data de criação
eventSchema.index({ createdAt: -1 });

// Índice composto para consultas otimizadas
eventSchema.index({ organizerId: 1, status: 1 });

/**
 * MÉTODOS ESTÁTICOS - CRUD Básico
 */

/**
 * Busca evento por ID público
 * @param {string} publicId - ID público do evento
 * @returns {Promise<Event|null>}
 */
eventSchema.statics.findByPublicId = async function(publicId) {
  try {
    return await this.findOne({ id: publicId });
  } catch (error) {
    throw new Error(`Erro ao buscar evento: ${error.message}`);
  }
};

/**
 * Cria novo evento com validação automática
 * @param {Object} eventData - Dados do evento
 * @returns {Promise<Event>}
 */
eventSchema.statics.createEvent = async function(eventData) {
  try {
    const event = new this(eventData);
    await event.validate();
    return await event.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Erro de validação: ${messages.join(', ')}`);
    }
    throw new Error(`Erro ao criar evento: ${error.message}`);
  }
};

/**
 * Atualiza evento por ID público
 * @param {string} publicId - ID público do evento
 * @param {Object} updateData - Dados para atualização
 * @returns {Promise<Event|null>}
 */
eventSchema.statics.updateByPublicId = async function(publicId, updateData) {
  try {
    // Remove campos que não devem ser atualizados
    const { id, organizerId, createdAt, ...safeUpdateData } = updateData;
    
    const updatedEvent = await this.findOneAndUpdate(
      { id: publicId },
      { $set: safeUpdateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    return updatedEvent;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Erro de validação: ${messages.join(', ')}`);
    }
    throw new Error(`Erro ao atualizar evento: ${error.message}`);
  }
};

/**
 * Remove evento por ID público (soft delete)
 * @param {string} publicId - ID público do evento
 * @returns {Promise<Event|null>}
 */
eventSchema.statics.deleteByPublicId = async function(publicId) {
  try {
    // Soft delete - apenas marca como cancelado
    return await this.updateByPublicId(publicId, { status: 'cancelled' });
  } catch (error) {
    throw new Error(`Erro ao deletar evento: ${error.message}`);
  }
};

/**
 * Busca evento com relacionamentos (guests e items)
 * @param {string} publicId - ID público do evento
 * @returns {Promise<Object|null>}
 */
eventSchema.statics.findWithRelations = async function(publicId) {
  try {
    const event = await this.findByPublicId(publicId);
    if (!event) return null;

    // Import dinâmico para evitar circular dependency
    const Guest = require('./Guest');
    const EventItem = require('./EventItem');

    // Busca relacionamentos
    const [guests, items] = await Promise.all([
      Guest.find({ eventId: publicId }),
      EventItem.find({ eventId: publicId })
    ]);

    return {
      ...event.toObject(),
      guests,
      items,
      stats: {
        totalGuests: guests.length,
        confirmedGuests: guests.filter(g => g.rsvpStatus === 'yes').length,
        pendingGuests: guests.filter(g => g.rsvpStatus === 'pending').length,
        totalItems: items.length,
        purchasedItems: items.filter(i => i.isPurchased).length
      }
    };
  } catch (error) {
    throw new Error(`Erro ao buscar evento com relacionamentos: ${error.message}`);
  }
};

/**
 * Busca eventos por organizador
 * @param {string} organizerId - ID do organizador
 * @param {Object} options - Opções de busca (limit, skip, status)
 * @returns {Promise<Event[]>}
 */
eventSchema.statics.findByOrganizer = async function(organizerId, options = {}) {
  try {
    const { limit = 20, skip = 0, status } = options;
    
    const query = { organizerId };
    if (status) {
      query.status = status;
    }
    
    return await this.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  } catch (error) {
    throw new Error(`Erro ao buscar eventos por organizador: ${error.message}`);
  }
};

/**
 * MÉTODOS DE INSTÂNCIA
 */

/**
 * Verifica se evento está ativo
 * @returns {boolean}
 */
eventSchema.methods.isActive = function() {
  return this.status === 'active';
};

/**
 * Verifica se evento já aconteceu
 * @returns {boolean}
 */
eventSchema.methods.isPast = function() {
  return this.date < new Date();
};

/**
 * Verifica se prazo de confirmação já passou
 * @returns {boolean}
 */
eventSchema.methods.isConfirmationExpired = function() {
  if (!this.confirmationDeadline) return false;
  return this.confirmationDeadline < new Date();
};

/**
 * HOOKS/MIDDLEWARE
 */

// Pre-save middleware para validações adicionais
eventSchema.pre('save', function(next) {
  // Validar prazo de confirmação
  if (this.confirmationDeadline && this.date) {
    if (this.confirmationDeadline >= this.date) {
      return next(new Error('Prazo de confirmação deve ser antes da data do evento'));
    }
  }
  
  next();
});

// Pre-validate middleware
eventSchema.pre('validate', function(next) {
  // Trimmar strings
  if (this.name) this.name = this.name.trim();
  if (this.location) this.location = this.location.trim();
  
  // Garantir que status seja lowercase ANTES da validação
  if (this.status) {
    this.status = this.status.toLowerCase();
  }
  
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;