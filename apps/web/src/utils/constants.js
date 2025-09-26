/**
 * @fileoverview Constantes da aplicação ChurrasApp
 * @author Dev Agent
 */

/**
 * Template básico de itens para eventos de churrasco
 * Inclui cálculo automático de quantidades baseado no número de participantes
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
    quantityPerPerson: 0.25, // 1kg para 4 pessoas
    estimatedCostPerKg: 1500 // R$ 15.00 em centavos
  }
];

/**
 * Calcula quantidades automáticas baseadas no número de participantes
 * @param {number} estimatedParticipants - Número estimado de participantes
 * @returns {Array} Array de itens com quantidades calculadas
 */
export const calculateEventItems = (estimatedParticipants) => {
  if (!estimatedParticipants || estimatedParticipants <= 0) {
    return [];
  }

  return BASIC_EVENT_TEMPLATE.map(item => {
    const quantity = item.quantityPerPerson * estimatedParticipants;
    const estimatedCost = item.estimatedCostPerKg 
      ? item.estimatedCostPerKg 
      : item.estimatedCostPerUnit;

    return {
      name: item.name,
      category: item.category,
      quantity: Math.round(quantity * 100) / 100, // Arredondar para 2 casas decimais
      unit: item.unit,
      estimatedCost: estimatedCost,
      isTemplate: true
    };
  });
};

/**
 * Categorias válidas para itens do evento
 */
export const EVENT_CATEGORIES = {
  CARNE: 'carne',
  BEBIDAS: 'bebidas',
  CARVAO: 'carvao',
  ACOMPANHAMENTOS: 'acompanhamentos',
  OUTROS: 'outros'
};

/**
 * Unidades válidas para itens do evento
 */
export const ITEM_UNITS = {
  KG: 'kg',
  UNIDADE: 'unidade',
  LITRO: 'litro',
  PACOTE: 'pacote'
};