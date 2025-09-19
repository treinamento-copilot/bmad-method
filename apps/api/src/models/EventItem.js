/**
 * @fileoverview Modelo de dados do Item do Evento
 * @author Dev Agent James
 */

const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

/**
 * Schema do EventItem com validações completas
 */
const eventItemSchema = new mongoose.Schema({
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
    required: [true, 'Nome do item é obrigatório'], 
    trim: true, 
    maxLength: [100, 'Nome do item deve ter no máximo 100 caracteres'],
    minLength: [2, 'Nome do item deve ter pelo menos 2 caracteres']
  },
  category: { 
    type: String, 
    enum: {
      values: ['carne', 'bebidas', 'carvao', 'acompanhamentos', 'extras'],
      message: 'Categoria deve ser: carne, bebidas, carvao, acompanhamentos ou extras'
    }, 
    required: [true, 'Categoria é obrigatória'],
    index: true
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantidade é obrigatória'], 
    min: [0, 'Quantidade não pode ser negativa'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Quantidade deve ser um número positivo ou zero'
    }
  },
  unit: { 
    type: String, 
    required: [true, 'Unidade é obrigatória'], 
    enum: {
      values: ['kg', 'unidade', 'litro', 'pacote'],
      message: 'Unidade deve ser: kg, unidade, litro ou pacote'
    }
  },
  estimatedCost: { 
    type: Number, 
    required: [true, 'Custo estimado é obrigatório'], 
    min: [0, 'Custo estimado não pode ser negativo'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Custo estimado deve ser um número positivo ou zero'
    }
  },
  actualCost: { 
    type: Number, 
    required: false, 
    min: [0, 'Custo real não pode ser negativo'],
    validate: {
      validator: function(value) {
        if (!value) return true; // Campo opcional
        return value >= 0;
      },
      message: 'Custo real deve ser um número positivo ou zero'
    }
  },
  assignedTo: { 
    type: String, 
    required: false,
    trim: true,
    maxLength: [100, 'Nome do responsável deve ter no máximo 100 caracteres']
  },
  isPurchased: { 
    type: Boolean, 
    default: false
  },
  isTemplate: { 
    type: Boolean, 
    default: false
  }
}, { 
  timestamps: true,
  collection: 'eventitems',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Índices para performance
 */
eventItemSchema.index({ eventId: 1 });
eventItemSchema.index({ eventId: 1, category: 1 });
eventItemSchema.index({ eventId: 1, isPurchased: 1 });
eventItemSchema.index({ isTemplate: 1 });
eventItemSchema.index({ createdAt: -1 });

/**
 * Virtual para diferença entre custo estimado e real
 */
eventItemSchema.virtual('costDifference').get(function() {
  if (!this.actualCost) return null;
  return this.actualCost - this.estimatedCost;
});

/**
 * Virtual para verificar se está acima do orçamento
 */
eventItemSchema.virtual('isOverBudget').get(function() {
  if (!this.actualCost) return false;
  return this.actualCost > this.estimatedCost;
});

/**
 * Virtual para custo total (quantity × cost)
 */
eventItemSchema.virtual('totalEstimatedCost').get(function() {
  return this.quantity * this.estimatedCost;
});

/**
 * Virtual para custo real total
 */
eventItemSchema.virtual('totalActualCost').get(function() {
  if (!this.actualCost) return null;
  return this.quantity * this.actualCost;
});

/**
 * Virtual para status de compra formatado
 */
eventItemSchema.virtual('purchaseStatus').get(function() {
  if (this.isPurchased) return 'purchased';
  if (this.assignedTo) return 'assigned';
  return 'pending';
});

/**
 * Método estático para buscar por ID público
 * @param {string} publicId - ID público do item
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.findByPublicId = function(publicId) {
  return this.findOne({ id: publicId });
};

/**
 * Método estático para buscar itens por evento
 * @param {string} eventId - ID do evento
 * @returns {Promise<EventItem[]>}
 */
eventItemSchema.statics.findByEventId = function(eventId) {
  return this.find({ eventId }).sort({ category: 1, name: 1 });
};

/**
 * Método estático para buscar templates
 * @returns {Promise<EventItem[]>}
 */
eventItemSchema.statics.findTemplates = function() {
  return this.find({ isTemplate: true }).sort({ category: 1, name: 1 });
};

/**
 * Método estático para criar item com validação
 * @param {Object} itemData - Dados do item
 * @returns {Promise<EventItem>}
 */
eventItemSchema.statics.createItem = async function(itemData) {
  const item = new this(itemData);
  return await item.save();
};

/**
 * Método estático para atualizar por ID público
 * @param {string} publicId - ID público do item
 * @param {Object} updateData - Dados para atualização
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.updateByPublicId = function(publicId, updateData) {
  // Remove campos que não devem ser atualizados diretamente
  const { id, _id, eventId, createdAt, ...safeUpdateData } = updateData;
  
  return this.findOneAndUpdate(
    { id: publicId }, 
    { ...safeUpdateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

/**
 * Método estático para marcar como comprado
 * @param {string} publicId - ID público do item
 * @param {number} actualCost - Custo real da compra
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.markAsPurchased = function(publicId, actualCost) {
  const updateData = { 
    isPurchased: true,
    updatedAt: new Date()
  };
  
  if (actualCost !== undefined) {
    updateData.actualCost = actualCost;
  }
  
  return this.findOneAndUpdate(
    { id: publicId }, 
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Método estático para atribuir responsável
 * @param {string} publicId - ID público do item
 * @param {string} assignedTo - Nome do responsável
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.assignTo = function(publicId, assignedTo) {
  return this.findOneAndUpdate(
    { id: publicId }, 
    { assignedTo, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

/**
 * Método estático para soft delete por ID público
 * @param {string} publicId - ID público do item
 * @returns {Promise<EventItem|null>}
 */
eventItemSchema.statics.deleteByPublicId = function(publicId) {
  return this.findOneAndDelete({ id: publicId });
};

/**
 * Método estático para estatísticas do evento
 * @param {string} eventId - ID do evento
 * @returns {Promise<Object>}
 */
eventItemSchema.statics.getEventStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { eventId } },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        purchasedItems: { 
          $sum: { $cond: ['$isPurchased', 1, 0] }
        },
        assignedItems: { 
          $sum: { $cond: [{ $ne: ['$assignedTo', null] }, 1, 0] }
        },
        totalEstimatedCost: { 
          $sum: { $multiply: ['$quantity', '$estimatedCost'] }
        },
        totalActualCost: { 
          $sum: { 
            $multiply: [
              '$quantity', 
              { $ifNull: ['$actualCost', 0] }
            ]
          }
        },
        categoriesBreakdown: {
          $push: {
            category: '$category',
            estimatedCost: { $multiply: ['$quantity', '$estimatedCost'] },
            actualCost: { 
              $multiply: [
                '$quantity', 
                { $ifNull: ['$actualCost', 0] }
              ]
            }
          }
        }
      }
    }
  ]);
  
  const result = stats[0] || {
    totalItems: 0,
    purchasedItems: 0,
    assignedItems: 0,
    totalEstimatedCost: 0,
    totalActualCost: 0,
    categoriesBreakdown: []
  };
  
  // Agrupar por categoria
  const categories = {};
  result.categoriesBreakdown.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = {
        estimatedCost: 0,
        actualCost: 0
      };
    }
    categories[item.category].estimatedCost += item.estimatedCost;
    categories[item.category].actualCost += item.actualCost;
  });
  
  result.categoriesBreakdown = categories;
  return result;
};

/**
 * Método estático para criar item a partir de template
 * @param {string} templateId - ID do template
 * @param {string} eventId - ID do evento
 * @param {Object} overrides - Dados para sobrescrever
 * @returns {Promise<EventItem>}
 */
eventItemSchema.statics.createFromTemplate = async function(templateId, eventId, overrides = {}) {
  const template = await this.findByPublicId(templateId);
  if (!template || !template.isTemplate) {
    throw new Error('Template não encontrado');
  }
  
  const itemData = {
    ...template.toObject(),
    ...overrides,
    id: randomUUID(), // Novo ID
    eventId,
    isTemplate: false,
    isPurchased: false,
    actualCost: undefined,
    assignedTo: undefined
  };
  
  delete itemData._id;
  delete itemData.__v;
  delete itemData.createdAt;
  delete itemData.updatedAt;
  
  return this.createItem(itemData);
};

/**
 * Método de instância para marcar como comprado
 */
eventItemSchema.methods.purchase = function(actualCost) {
  this.isPurchased = true;
  if (actualCost !== undefined) {
    this.actualCost = actualCost;
  }
  return this.save();
};

/**
 * Método de instância para atribuir responsável
 */
eventItemSchema.methods.assign = function(assignedTo) {
  this.assignedTo = assignedTo;
  return this.save();
};

/**
 * Pre-save middleware para validações customizadas
 */
eventItemSchema.pre('save', function(next) {
  // Se está marcado como comprado mas não tem custo real, usar estimado
  if (this.isPurchased && !this.actualCost) {
    this.actualCost = this.estimatedCost;
  }
  
  next();
});

/**
 * Post-save middleware para logging
 */
eventItemSchema.post('save', function(doc) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`✅ Item salvo: ${doc.name} (${doc.id}) - Categoria: ${doc.category}`);
  }
});

const EventItem = mongoose.model('EventItem', eventItemSchema);

module.exports = EventItem;