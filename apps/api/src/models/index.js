/**
 * @fileoverview Models Index - Centraliza exportações dos modelos MongoDB
 * Facilita importação dos models e garante carregamento correto
 */

const Event = require('./Event');
const Guest = require('./Guest');
const EventItem = require('./EventItem');

/**
 * Exporta todos os models do banco de dados
 * Uso: const { Event, Guest, EventItem } = require('./models');
 */
module.exports = {
  Event,
  Guest,
  EventItem
};

/**
 * Função utilitária para verificar se todos os models estão carregados
 * @returns {boolean}
 */
function areModelsLoaded() {
  try {
    return !!(Event && Guest && EventItem);
  } catch (error) {
    console.error('❌ Erro ao carregar models:', error.message);
    return false;
  }
}

/**
 * Lista todos os models disponíveis
 * @returns {string[]}
 */
function listAvailableModels() {
  return Object.keys(module.exports);
}

// Exportar funções utilitárias também
module.exports.areModelsLoaded = areModelsLoaded;
module.exports.listAvailableModels = listAvailableModels;