/**
 * Template básico de itens para eventos de churrasco
 * Quantidades calculadas automaticamente baseadas no número de pessoas
 */
export const BASIC_EVENT_TEMPLATE = [
  {
    name: 'Picanha',
    category: 'carne',
    unit: 'kg',
    quantityPerPerson: 0.4,
    estimatedCostPerKg: 8000 // R$ 80.00 em centavos
  },
  {
    name: 'Cerveja',
    category: 'bebidas', 
    unit: 'unidade',
    quantityPerPerson: 2,
    estimatedCostPerUnit: 500 // R$ 5.00 em centavos
  },
  {
    name: 'Carvão',
    category: 'carvao',
    unit: 'kg', 
    quantityPerPerson: 0.25,
    estimatedCostPerKg: 1500 // R$ 15.00 em centavos
  }
];

/**
 * Calcula as quantidades e custos dos itens do template baseado no número de participantes
 * @param {number} estimatedParticipants - Número estimado de participantes
 * @returns {Array} Array com itens calculados para o evento
 */
export const calculateTemplateItems = (estimatedParticipants) => {
  return BASIC_EVENT_TEMPLATE.map(templateItem => {
    const quantity = templateItem.quantityPerPerson * estimatedParticipants;
    
    // Calcula custo baseado no tipo de unidade
    let estimatedCost;
    if (templateItem.unit === 'kg') {
      estimatedCost = quantity * (templateItem.estimatedCostPerKg || 0);
    } else if (templateItem.unit === 'unidade') {
      estimatedCost = quantity * (templateItem.estimatedCostPerUnit || 0);
    } else {
      estimatedCost = 0;
    }

    return {
      name: templateItem.name,
      category: templateItem.category,
      quantity: Math.round(quantity * 100) / 100, // Arredonda para 2 casas decimais
      unit: templateItem.unit,
      estimatedCost: Math.round(estimatedCost),
      isTemplate: true
    };
  });
};

/**
 * Categorias válidas para itens de evento
 */
export const EVENT_ITEM_CATEGORIES = [
  'carne',
  'bebidas', 
  'carvao',
  'acompanhamentos',
  'extras'
];

/**
 * Unidades válidas para itens de evento
 */
export const EVENT_ITEM_UNITS = [
  'kg',
  'unidade',
  'litro', 
  'pacote'
];

/**
 * Limites para validação de eventos
 */
export const EVENT_LIMITS = {
  MIN_PARTICIPANTS: 1,
  MAX_PARTICIPANTS: 50,
  MAX_NAME_LENGTH: 100,
  MAX_LOCATION_LENGTH: 200
};

/**
 * Status possíveis para eventos
 */
export const EVENT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};