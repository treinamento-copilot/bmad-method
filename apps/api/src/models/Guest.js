const mongoose = require('mongoose');
const { generateUniqueId } = require('../utils/database');

/**
 * @fileoverview Guest Model - Schema para convidados do ChurrasApp
 * Implementa schema detalhado conforme especificação da arquitetura
 */

const guestSchema = new mongoose.Schema({
  // ID público único (UUID v4)
  id: {
    type: String,
    required: true,
    unique: true,
    default: generateUniqueId,
    index: true
  },
  
  // ID do evento (relacionamento)
  eventId: {
    type: String,
    required: [true, 'ID do evento é obrigatório'],
    index: true,
    validate: {
      validator: function(value) {
        // Validação básica de formato UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
      },
      message: 'ID do evento deve ser um UUID válido'
    }
  },
  
  // Nome do convidado
  name: {
    type: String,
    required: [true, 'Nome do convidado é obrigatório'],
    trim: true,
    maxLength: [100, 'Nome não pode exceder 100 caracteres'],
    minLength: [2, 'Nome deve ter pelo menos 2 caracteres']
  },
  
  // Telefone (opcional)
  phone: {
    type: String,
    required: false,
    trim: true,
    maxLength: [20, 'Telefone não pode exceder 20 caracteres'],
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        // Aceita formatos: (11) 99999-9999, 11 99999-9999, 11999999999, +55 11 99999-9999, (11) 9999-9999
        const phoneRegex = /^(\+55\s?)?\(?([1-9]{2})\)?\s?([0-9]{4,5})-?([0-9]{4})$/;
        return phoneRegex.test(value);
      },
      message: 'Formato de telefone inválido'
    }
  },
  
  // Status de confirmação (RSVP)
  rsvpStatus: {
    type: String,
    enum: {
      values: ['pending', 'yes', 'no', 'maybe'],
      message: 'Status RSVP deve ser: pending, yes, no ou maybe'
    },
    default: 'pending',
    index: true
  },
  
  // Status de pagamento
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid'],
      message: 'Status de pagamento deve ser: pending ou paid'
    },
    default: 'pending',
    index: true
  },
  
  // Método de pagamento
  paymentMethod: {
    type: String,
    enum: {
      values: ['pix', 'dinheiro', 'transferencia'],
      message: 'Método de pagamento deve ser: pix, dinheiro ou transferencia'
    },
    required: false
  },
  
  // Data de confirmação
  confirmedAt: {
    type: Date,
    required: false,
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        return value <= new Date();
      },
      message: 'Data de confirmação não pode ser no futuro'
    }
  }
}, {
  // Timestamps automáticos (createdAt, updatedAt)
  timestamps: true,
  
  // Configurações do schema
  collection: 'guests',
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
guestSchema.index({ id: 1 }, { unique: true });

// Índice para eventId (consultas por evento)
guestSchema.index({ eventId: 1 });

// Índice para status RSVP (filtros por confirmação)
guestSchema.index({ rsvpStatus: 1 });

// Índice para status de pagamento (filtros por pagamento)
guestSchema.index({ paymentStatus: 1 });

// Índice composto para consultas otimizadas
guestSchema.index({ eventId: 1, rsvpStatus: 1 });
guestSchema.index({ eventId: 1, paymentStatus: 1 });

// Índice temporal para ordenação
guestSchema.index({ createdAt: -1 });

/**
 * MÉTODOS ESTÁTICOS - CRUD Básico
 */

/**
 * Busca convidado por ID público
 * @param {string} publicId - ID público do convidado
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.findByPublicId = async function(publicId) {
  try {
    return await this.findOne({ id: publicId });
  } catch (error) {
    throw new Error(`Erro ao buscar convidado: ${error.message}`);
  }
};

/**
 * Cria novo convidado com validação automática
 * @param {Object} guestData - Dados do convidado
 * @returns {Promise<Guest>}
 */
guestSchema.statics.createGuest = async function(guestData) {
  try {
    const guest = new this(guestData);
    await guest.validate();
    return await guest.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Erro de validação: ${messages.join(', ')}`);
    }
    throw new Error(`Erro ao criar convidado: ${error.message}`);
  }
};

/**
 * Atualiza convidado por ID público
 * @param {string} publicId - ID público do convidado
 * @param {Object} updateData - Dados para atualização
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.updateByPublicId = async function(publicId, updateData) {
  try {
    // Remove campos que não devem ser atualizados
    const { id, eventId, createdAt, ...safeUpdateData } = updateData;
    
    // Se confirmando presença, definir data de confirmação
    if (safeUpdateData.rsvpStatus === 'yes' && !safeUpdateData.confirmedAt) {
      safeUpdateData.confirmedAt = new Date();
    }
    
    const updatedGuest = await this.findOneAndUpdate(
      { id: publicId },
      { $set: safeUpdateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    return updatedGuest;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Erro de validação: ${messages.join(', ')}`);
    }
    throw new Error(`Erro ao atualizar convidado: ${error.message}`);
  }
};

/**
 * Remove convidado por ID público
 * @param {string} publicId - ID público do convidado
 * @returns {Promise<Guest|null>}
 */
guestSchema.statics.deleteByPublicId = async function(publicId) {
  try {
    return await this.findOneAndDelete({ id: publicId });
  } catch (error) {
    throw new Error(`Erro ao deletar convidado: ${error.message}`);
  }
};

/**
 * Busca convidados por evento
 * @param {string} eventId - ID do evento
 * @param {Object} options - Opções de busca (limit, skip, rsvpStatus, paymentStatus)
 * @returns {Promise<Guest[]>}
 */
guestSchema.statics.findByEvent = async function(eventId, options = {}) {
  try {
    const { limit = 50, skip = 0, rsvpStatus, paymentStatus } = options;
    
    const query = { eventId };
    if (rsvpStatus) {
      query.rsvpStatus = rsvpStatus;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    return await this.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  } catch (error) {
    throw new Error(`Erro ao buscar convidados por evento: ${error.message}`);
  }
};

/**
 * Conta convidados por status
 * @param {string} eventId - ID do evento
 * @returns {Promise<Object>}
 */
guestSchema.statics.countByStatus = async function(eventId) {
  try {
    const result = await this.aggregate([
      { $match: { eventId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'yes'] }, 1, 0] } },
          declined: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'no'] }, 1, 0] } },
          maybe: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'maybe'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$rsvpStatus', 'pending'] }, 1, 0] } },
          paid: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
          unpaid: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } }
        }
      }
    ]);
    
    return result[0] || {
      total: 0,
      confirmed: 0,
      declined: 0,
      maybe: 0,
      pending: 0,
      paid: 0,
      unpaid: 0
    };
  } catch (error) {
    throw new Error(`Erro ao contar convidados por status: ${error.message}`);
  }
};

/**
 * MÉTODOS DE INSTÂNCIA
 */

/**
 * Verifica se convidado confirmou presença
 * @returns {boolean}
 */
guestSchema.methods.hasConfirmed = function() {
  return this.rsvpStatus === 'yes';
};

/**
 * Verifica se convidado recusou
 * @returns {boolean}
 */
guestSchema.methods.hasDeclined = function() {
  return this.rsvpStatus === 'no';
};

/**
 * Verifica se pagamento foi efetuado
 * @returns {boolean}
 */
guestSchema.methods.hasPaid = function() {
  return this.paymentStatus === 'paid';
};

/**
 * Confirma presença do convidado
 * @returns {Promise<Guest>}
 */
guestSchema.methods.confirmAttendance = async function() {
  this.rsvpStatus = 'yes';
  this.confirmedAt = new Date();
  return await this.save();
};

/**
 * Marca pagamento como efetuado
 * @param {string} method - Método de pagamento
 * @returns {Promise<Guest>}
 */
guestSchema.methods.markAsPaid = async function(method) {
  if (!['pix', 'dinheiro', 'transferencia'].includes(method)) {
    throw new Error('Método de pagamento inválido');
  }
  
  this.paymentStatus = 'paid';
  this.paymentMethod = method;
  return await this.save();
};

/**
 * HOOKS/MIDDLEWARE
 */

// Pre-save middleware para validações adicionais
guestSchema.pre('save', function(next) {
  // Validar método de pagamento obrigatório quando pago
  if (this.paymentStatus === 'paid' && !this.paymentMethod) {
    return next(new Error('Método de pagamento é obrigatório quando status é "paid"'));
  }
  
  // Se confirmando presença e não tem data de confirmação, definir agora
  if (this.rsvpStatus === 'yes' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  
  // Se mudando para não confirmado, limpar data de confirmação
  if (this.rsvpStatus !== 'yes' && this.confirmedAt) {
    this.confirmedAt = undefined;
  }
  
  next();
});

// Pre-validate middleware
guestSchema.pre('validate', function(next) {
  // Trimmar strings
  if (this.name) this.name = this.name.trim();
  if (this.phone) this.phone = this.phone.trim();
  
  // Garantir que status sejam lowercase ANTES da validação
  if (this.rsvpStatus) {
    this.rsvpStatus = this.rsvpStatus.toLowerCase();
  }
  if (this.paymentStatus) {
    this.paymentStatus = this.paymentStatus.toLowerCase();
  }
  if (this.paymentMethod) {
    this.paymentMethod = this.paymentMethod.toLowerCase();
  }
  
  next();
});

// Validação customizada para relacionamento com Event
guestSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('eventId')) {
    try {
      const Event = require('./Event');
      const event = await Event.findByPublicId(this.eventId);
      
      if (!event) {
        return next(new Error('Evento não encontrado'));
      }
      
      if (event.status === 'cancelled') {
        return next(new Error('Não é possível adicionar convidados a evento cancelado'));
      }
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;