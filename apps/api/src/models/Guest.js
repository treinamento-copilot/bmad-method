/**
 * @fileoverview Modelo de dados do Convidado
 * @author Dev Agent James
 */

const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

/**
 * Schema do Guest com validações completas
 */
const guestSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => randomUUID()
  },
  eventId: { 
    type: String, 
    required: [true, 'ID do evento é obrigatório'], 
    validate: {
      validator: function(value) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
      },
      message: 'ID do evento deve ser um UUID válido'
    }
  },
  name: { 
    type: String, 
    required: [true, 'Nome do convidado é obrigatório'], 
    trim: true, 
    maxLength: [100, 'Nome do convidado deve ter no máximo 100 caracteres'],
    minLength: [2, 'Nome do convidado deve ter pelo menos 2 caracteres']
  },
  phone: { 
    type: String, 
    required: false, 
    trim: true, 
    maxLength: [20, 'Telefone deve ter no máximo 20 caracteres'],
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        // Regex básico para telefone brasileiro
        return /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}\-?\d{4}$/.test(value);
      },
      message: 'Formato de telefone inválido'
    }
  },
  rsvpStatus: { 
    type: String, 
    enum: {
      values: ['pending', 'yes', 'no', 'maybe'],
      message: 'RSVP deve ser: pending, yes, no ou maybe'
    }, 
    default: 'pending',
    index: true
  },
  paymentStatus: { 
    type: String, 
    enum: {
      values: ['pending', 'paid'],
      message: 'Status de pagamento deve ser: pending ou paid'
    }, 
    default: 'pending',
    index: true
  },
  paymentMethod: { 
    type: String, 
    enum: {
      values: ['pix', 'dinheiro', 'transferencia'],
      message: 'Método de pagamento deve ser: pix, dinheiro ou transferencia'
    }, 
    required: false
  },
  confirmedAt: { 
    type: Date, 
    required: false,
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        return value <= new Date(); // Não pode ser no futuro
      },
      message: 'Data de confirmação não pode ser no futuro'
    }
  }
}, { 
  timestamps: true,
  collection: 'guests',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Índices para performance
 */
guestSchema.index({ eventId: 1 });
guestSchema.index({ eventId: 1, rsvpStatus: 1 });
guestSchema.index({ createdAt: -1 });

/**
 * Virtual para verificar se está confirmado
 */
guestSchema.virtual('isConfirmed').get(function() {
  return this.rsvpStatus === 'yes';
});

/**
 * Virtual para verificar se pagou
 */
guestSchema.virtual('hasPaid').get(function() {
  return this.paymentStatus === 'paid';
});

/**
 * Virtual para tempo desde confirmação
 */
guestSchema.virtual('daysSinceConfirmation').get(function() {
  if (!this.confirmedAt) return null;
  const diffTime = new Date().getTime() - this.confirmedAt.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

/**
 * Método estático para buscar por ID público
 * @param {string} publicId - ID público do convidado
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.findByPublicId = function(publicId) {
  return this.findOne({ id: publicId });
};

/**
 * Método estático para buscar convidados por evento
 * @param {string} eventId - ID do evento
 * @returns {Promise<Guest[]>}
 */
guestSchema.statics.findByEventId = function(eventId) {
  return this.find({ eventId }).sort({ createdAt: -1 });
};

/**
 * Método estático para criar convidado com validação
 * @param {Object} guestData - Dados do convidado
 * @returns {Promise<Guest>}
 */
guestSchema.statics.createGuest = async function(guestData) {
  const guest = new this(guestData);
  return await guest.save();
};

/**
 * Método estático para atualizar por ID público
 * @param {string} publicId - ID público do convidado
 * @param {Object} updateData - Dados para atualização
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.updateByPublicId = function(publicId, updateData) {
  // Remove campos que não devem ser atualizados diretamente
  const { id, _id, eventId, createdAt, ...safeUpdateData } = updateData;
  
  return this.findOneAndUpdate(
    { id: publicId }, 
    { ...safeUpdateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

/**
 * Método estático para confirmar RSVP
 * @param {string} publicId - ID público do convidado
 * @param {string} status - Status do RSVP
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.updateRSVP = function(publicId, status) {
  const updateData = { 
    rsvpStatus: status,
    updatedAt: new Date()
  };
  
  // Se confirmando, adicionar timestamp
  if (status === 'yes') {
    updateData.confirmedAt = new Date();
  }
  
  return this.findOneAndUpdate(
    { id: publicId }, 
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Método estático para soft delete por ID público
 * @param {string} publicId - ID público do convidado
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.deleteByPublicId = function(publicId) {
  return this.findOneAndDelete({ id: publicId });
};

/**
 * Método estático para estatísticas do evento
 * @param {string} eventId - ID do evento
 * @returns {Promise<Object>}
 */
guestSchema.statics.getEventStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { eventId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        confirmed: { 
          $sum: { $cond: [{ $eq: ['$rsvpStatus', 'yes'] }, 1, 0] }
        },
        declined: { 
          $sum: { $cond: [{ $eq: ['$rsvpStatus', 'no'] }, 1, 0] }
        },
        pending: { 
          $sum: { $cond: [{ $eq: ['$rsvpStatus', 'pending'] }, 1, 0] }
        },
        maybe: { 
          $sum: { $cond: [{ $eq: ['$rsvpStatus', 'maybe'] }, 1, 0] }
        },
        paid: { 
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    maybe: 0,
    paid: 0
  };
};

/**
 * Método de instância para confirmar participação
 */
guestSchema.methods.confirmAttendance = function() {
  this.rsvpStatus = 'yes';
  this.confirmedAt = new Date();
  return this.save();
};

/**
 * Método de instância para marcar pagamento
 */
guestSchema.methods.markAsPaid = function(method) {
  this.paymentStatus = 'paid';
  if (method) this.paymentMethod = method;
  return this.save();
};

/**
 * Pre-save middleware para validações customizadas
 */
guestSchema.pre('save', function(next) {
  // Se confirmando, garantir que tem timestamp
  if (this.rsvpStatus === 'yes' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  
  // Se não confirmado, limpar timestamp
  if (this.rsvpStatus !== 'yes' && this.confirmedAt) {
    this.confirmedAt = undefined;
  }
  
  next();
});

/**
 * Post-save middleware para logging
 */
guestSchema.post('save', function(doc) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`✅ Convidado salvo: ${doc.name} (${doc.id}) - Status: ${doc.rsvpStatus}`);
  }
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;