const mongoose = require('mongoose');
const { generateUniqueId } = require('../utils/database');

/**
 * @fileoverview EventItem Model - Schema para itens de eventos do ChurrasApp
 * Implementa schema detalhado conforme especificação da arquitetura
 */

const eventItemSchema = new mongoose.Schema({
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
    required: function() {
      return !this.isTemplate; // Obrigatório apenas se não for template
    },
    index: true,
    validate: {
      validator: function(value) {
        if (!value && this.isTemplate) return true; // Templates podem não ter eventId
        if (!value) return false; // Não templates devem ter eventId
        // Validação básica de formato UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
      },
      message: 'ID do evento deve ser um UUID válido'
    }
  },
  
  // Nome do item
  name: {
    type: String,
    required: [true, 'Nome do item é obrigatório'],
    trim: true,
    maxLength: [100, 'Nome não pode exceder 100 caracteres'],
    minLength: [2, 'Nome deve ter pelo menos 2 caracteres']
  },
  
  // Categoria do item
  category: {
    type: String,
    enum: {
      values: ['carne', 'bebidas', 'carvao', 'acompanhamentos', 'extras'],
      message: 'Categoria deve ser: carne, bebidas, carvao, acompanhamentos ou extras'
    },
    required: [true, 'Categoria é obrigatória'],
    index: true
  },
  
  // Quantidade
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0, 'Quantidade não pode ser negativa'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Quantidade deve ser um número positivo'
    }
  },
  
  // Unidade de medida
  unit: {
    type: String,
    enum: {
      values: ['kg', 'unidade', 'litro', 'pacote'],
      message: 'Unidade deve ser: kg, unidade, litro ou pacote'
    },
    required: [true, 'Unidade é obrigatória']
  },
  
  // Custo estimado
  estimatedCost: {
    type: Number,
    required: [true, 'Custo estimado é obrigatório'],
    min: [0, 'Custo estimado não pode ser negativo'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Custo estimado deve ser um número positivo'
    }
  },
  
  // Custo real (opcional, preenchido após compra)
  actualCost: {
    type: Number,
    required: false,
    min: [0, 'Custo real não pode ser negativo'],
    validate: {
      validator: function(value) {
        if (value === null || value === undefined) return true; // Campo opcional
        return value >= 0;
      },
      message: 'Custo real deve ser um número positivo'
    }
  },
  
  // Responsável pela compra (opcional)
  assignedTo: {
    type: String,
    required: false,
    trim: true,
    maxLength: [100, 'Nome do responsável não pode exceder 100 caracteres']
  },
  
  // Status de compra
  isPurchased: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Indica se é um item template (para reutilização)
  isTemplate: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  // Timestamps automáticos (createdAt, updatedAt)
  timestamps: true,
  
  // Configurações do schema
  collection: 'eventitems',
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
eventItemSchema.index({ id: 1 }, { unique: true });

// Índice para eventId (consultas por evento)
eventItemSchema.index({ eventId: 1 });

// Índice para categoria (filtros por tipo)
eventItemSchema.index({ category: 1 });

// Índice para status de compra (filtros por comprado/não comprado)
eventItemSchema.index({ isPurchased: 1 });

// Índice para templates (filtros por templates)
eventItemSchema.index({ isTemplate: 1 });

// Índices compostos para consultas otimizadas
eventItemSchema.index({ eventId: 1, category: 1 });
eventItemSchema.index({ eventId: 1, isPurchased: 1 });
eventItemSchema.index({ isTemplate: 1, category: 1 });

// Índice temporal para ordenação
eventItemSchema.index({ createdAt: -1 });

/**
 * MÉTODOS ESTÁTICOS - CRUD Básico
 */

/**
 * Busca item por ID público
 * @param {string} publicId - ID público do item
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.findByPublicId = async function(publicId) {
  try {
    return await this.findOne({ id: publicId });
  } catch (error) {
    throw new Error(`Erro ao buscar item: ${error.message}`);
  }
};

/**
 * Cria novo item com validação automática
 * @param {Object} itemData - Dados do item
 * @returns {Promise<EventItem>}
 */
eventItemSchema.statics.createItem = async function(itemData) {
  try {
    const item = new this(itemData);
    await item.validate();
    return await item.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Erro de validação: ${messages.join(', ')}`);
    }
    throw new Error(`Erro ao criar item: ${error.message}`);
  }
};

/**
 * Atualiza item por ID público
 * @param {string} publicId - ID público do item
 * @param {Object} updateData - Dados para atualização
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.updateByPublicId = async function(publicId, updateData) {
  try {
    // Remove campos que não devem ser atualizados
    const { id, eventId, createdAt, ...safeUpdateData } = updateData;
    
    const updatedItem = await this.findOneAndUpdate(
      { id: publicId },
      { $set: safeUpdateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    return updatedItem;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Erro de validação: ${messages.join(', ')}`);
    }
    throw new Error(`Erro ao atualizar item: ${error.message}`);
  }
};

/**
 * Remove item por ID público
 * @param {string} publicId - ID público do item
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.deleteByPublicId = async function(publicId) {
  try {
    return await this.findOneAndDelete({ id: publicId });
  } catch (error) {
    throw new Error(`Erro ao deletar item: ${error.message}`);
  }
};

/**
 * Busca itens por evento
 * @param {string} eventId - ID do evento
 * @param {Object} options - Opções de busca (limit, skip, category, isPurchased)
 * @returns {Promise<EventItem[]>}
 */
eventItemSchema.statics.findByEvent = async function(eventId, options = {}) {
  try {
    const { limit = 100, skip = 0, category, isPurchased } = options;
    
    const query = { eventId };
    if (category) {
      query.category = category;
    }
    if (typeof isPurchased === 'boolean') {
      query.isPurchased = isPurchased;
    }
    
    return await this.find(query)
      .sort({ category: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip);
  } catch (error) {
    throw new Error(`Erro ao buscar itens por evento: ${error.message}`);
  }
};

/**
 * Busca templates de itens
 * @param {Object} options - Opções de busca (category, limit, skip)
 * @returns {Promise<EventItem[]>}
 */
eventItemSchema.statics.findTemplates = async function(options = {}) {
  try {
    const { category, limit = 50, skip = 0 } = options;
    
    const query = { isTemplate: true };
    if (category) {
      query.category = category;
    }
    
    return await this.find(query)
      .sort({ category: 1, name: 1 })
      .limit(limit)
      .skip(skip);
  } catch (error) {
    throw new Error(`Erro ao buscar templates: ${error.message}`);
  }
};

/**
 * Calcula estatísticas de itens por evento
 * @param {string} eventId - ID do evento
 * @returns {Promise<Object>}
 */
eventItemSchema.statics.calculateEventStats = async function(eventId) {
  try {
    const result = await this.aggregate([
      { $match: { eventId } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          purchasedItems: { $sum: { $cond: ['$isPurchased', 1, 0] } },
          pendingItems: { $sum: { $cond: ['$isPurchased', 0, 1] } },
          totalEstimatedCost: { $sum: '$estimatedCost' },
          totalActualCost: { $sum: { $ifNull: ['$actualCost', 0] } },
          categories: { $addToSet: '$category' }
        }
      }
    ]);
    
    const stats = result[0] || {
      totalItems: 0,
      purchasedItems: 0,
      pendingItems: 0,
      totalEstimatedCost: 0,
      totalActualCost: 0,
      categories: []
    };
    
    // Calcular estatísticas por categoria
    const categoryStats = await this.aggregate([
      { $match: { eventId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          purchased: { $sum: { $cond: ['$isPurchased', 1, 0] } },
          estimatedCost: { $sum: '$estimatedCost' },
          actualCost: { $sum: { $ifNull: ['$actualCost', 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    stats.byCategory = categoryStats.reduce((acc, cat) => {
      acc[cat._id] = {
        count: cat.count,
        purchased: cat.purchased,
        pending: cat.count - cat.purchased,
        estimatedCost: cat.estimatedCost,
        actualCost: cat.actualCost
      };
      return acc;
    }, {});
    
    return stats;
  } catch (error) {
    throw new Error(`Erro ao calcular estatísticas: ${error.message}`);
  }
};

/**
 * Cria itens a partir de templates
 * @param {string} eventId - ID do evento
 * @param {string[]} templateIds - IDs dos templates
 * @returns {Promise<EventItem[]>}
 */
eventItemSchema.statics.createFromTemplates = async function(eventId, templateIds) {
  try {
    const templates = await this.find({ 
      id: { $in: templateIds }, 
      isTemplate: true 
    });
    
    if (templates.length !== templateIds.length) {
      throw new Error('Alguns templates não foram encontrados');
    }
    
    const newItems = templates.map(template => ({
      eventId,
      name: template.name,
      category: template.category,
      quantity: template.quantity,
      unit: template.unit,
      estimatedCost: template.estimatedCost,
      isTemplate: false
    }));
    
    return await this.insertMany(newItems);
  } catch (error) {
    throw new Error(`Erro ao criar itens a partir de templates: ${error.message}`);
  }
};

/**
 * MÉTODOS DE INSTÂNCIA
 */

/**
 * Verifica se item foi comprado
 * @returns {boolean}
 */
eventItemSchema.methods.wasPurchased = function() {
  return this.isPurchased;
};

/**
 * Verifica se é um template
 * @returns {boolean}
 */
eventItemSchema.methods.isTemplateItem = function() {
  return this.isTemplate;
};

/**
 * Marca item como comprado
 * @param {number} actualCost - Custo real pago
 * @param {string} assignedTo - Responsável pela compra
 * @returns {Promise<EventItem>}
 */
eventItemSchema.methods.markAsPurchased = async function(actualCost, assignedTo) {
  if (actualCost !== undefined && actualCost < 0) {
    throw new Error('Custo real não pode ser negativo');
  }
  
  this.isPurchased = true;
  if (actualCost !== undefined) {
    this.actualCost = actualCost;
  }
  if (assignedTo) {
    this.assignedTo = assignedTo.trim();
  }
  
  return await this.save();
};

/**
 * Desmarca item como comprado
 * @returns {Promise<EventItem>}
 */
eventItemSchema.methods.markAsNotPurchased = async function() {
  this.isPurchased = false;
  this.actualCost = undefined;
  
  return await this.save();
};

/**
 * Converte item para template
 * @returns {Promise<EventItem>}
 */
eventItemSchema.methods.convertToTemplate = async function() {
  // Criar novo template baseado neste item
  const templateData = {
    name: this.name,
    category: this.category,
    quantity: this.quantity,
    unit: this.unit,
    estimatedCost: this.estimatedCost,
    isTemplate: true
    // Não incluir eventId, actualCost, assignedTo, isPurchased
  };
  
  return await this.constructor.createItem(templateData);
};

/**
 * HOOKS/MIDDLEWARE
 */

// Pre-save middleware para validações adicionais
eventItemSchema.pre('save', function(next) {
  // Se é template, não pode ter eventId
  if (this.isTemplate && this.eventId) {
    this.eventId = undefined;
  }
  
  // Se foi comprado mas não tem custo real, usar estimado
  if (this.isPurchased && !this.actualCost) {
    this.actualCost = this.estimatedCost;
  }
  
  next();
});

// Pre-validate middleware
eventItemSchema.pre('validate', function(next) {
  // Trimmar strings
  if (this.name) this.name = this.name.trim();
  if (this.assignedTo) this.assignedTo = this.assignedTo.trim();
  
  // Garantir que categoria e unidade sejam lowercase ANTES da validação
  if (this.category) {
    this.category = this.category.toLowerCase();
  }
  if (this.unit) {
    this.unit = this.unit.toLowerCase();
  }
  
  next();
});

// Validação customizada para relacionamento com Event
eventItemSchema.pre('save', async function(next) {
  // Templates não precisam de evento
  if (this.isTemplate) {
    return next();
  }
  
  if (this.isNew || this.isModified('eventId')) {
    try {
      const Event = require('./Event');
      const event = await Event.findByPublicId(this.eventId);
      
      if (!event) {
        return next(new Error('Evento não encontrado'));
      }
      
      if (event.status === 'cancelled') {
        return next(new Error('Não é possível adicionar itens a evento cancelado'));
      }
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

const EventItem = mongoose.model('EventItem', eventItemSchema);

module.exports = EventItem;