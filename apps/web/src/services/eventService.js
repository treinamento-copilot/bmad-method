import api from './api';
import { calculateTemplateItems } from '../utils/constants';

/**
 * Serviço para operações relacionadas a eventos
 * Gerencia comunicação com a API de eventos
 */
export const eventService = {
  /**
   * Cria um novo evento de churrasco
   * @param {Object} eventData - Dados do evento
   * @param {string} eventData.name - Nome do evento
   * @param {string} eventData.date - Data do evento (ISO string)
   * @param {string} eventData.location - Local do evento
   * @param {number} eventData.estimatedParticipants - Número estimado de participantes
   * @returns {Promise<Object>} Evento criado com ID e itens básicos
   */
  async createEvent(eventData) {
    try {
      // Valida dados obrigatórios
      if (!eventData.name?.trim()) {
        throw new Error('Nome do evento é obrigatório');
      }
      
      if (!eventData.date) {
        throw new Error('Data do evento é obrigatória');
      }
      
      if (!eventData.location?.trim()) {
        throw new Error('Local do evento é obrigatório');
      }
      
      if (!eventData.estimatedParticipants || eventData.estimatedParticipants < 1) {
        throw new Error('Número de participantes deve ser pelo menos 1');
      }

      // Prepara dados para envio
      const eventPayload = {
        name: eventData.name.trim(),
        date: new Date(eventData.date).toISOString(),
        location: eventData.location.trim(),
        estimatedParticipants: parseInt(eventData.estimatedParticipants)
      };

      // Calcula itens do template básico
      const templateItems = calculateTemplateItems(eventPayload.estimatedParticipants);

      // Adiciona itens do template ao payload
      eventPayload.items = templateItems;

      // Chama API para criar evento
      const response = await api.post('events', eventPayload);

      // Retorna evento criado
      return response.data || response;

    } catch (error) {
      // Re-throw erros de API mantendo contexto
      if (error.name === 'ApiError') {
        throw error;
      }
      
      // Wrap outros erros
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }
  },

  /**
   * Busca um evento pelo ID
   * @param {string} eventId - ID do evento
   * @returns {Promise<Object>} Dados do evento
   */
  async getEvent(eventId) {
    try {
      if (!eventId) {
        throw new Error('ID do evento é obrigatório');
      }

      const response = await api.get(`events/${eventId}`);
      return response.data || response;

    } catch (error) {
      if (error.name === 'ApiError') {
        throw error;
      }
      
      throw new Error(`Erro ao buscar evento: ${error.message}`);
    }
  },

  /**
   * Atualiza dados básicos de um evento
   * @param {string} eventId - ID do evento
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Evento atualizado
   */
  async updateEvent(eventId, updateData) {
    try {
      if (!eventId) {
        throw new Error('ID do evento é obrigatório');
      }

      const response = await api.put(`events/${eventId}`, updateData);
      return response.data || response;

    } catch (error) {
      if (error.name === 'ApiError') {
        throw error;
      }
      
      throw new Error(`Erro ao atualizar evento: ${error.message}`);
    }
  },

  /**
   * Lista eventos (para futuro uso)
   * @param {Object} filters - Filtros opcionais
   * @returns {Promise<Array>} Lista de eventos
   */
  async listEvents(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const endpoint = queryParams.toString() ? `events?${queryParams}` : 'events';
      
      const response = await api.get(endpoint);
      return response.data || response;

    } catch (error) {
      if (error.name === 'ApiError') {
        throw error;
      }
      
      throw new Error(`Erro ao listar eventos: ${error.message}`);
    }
  },

  /**
   * Deleta um evento
   * @param {string} eventId - ID do evento
   * @returns {Promise<void>}
   */
  async deleteEvent(eventId) {
    try {
      if (!eventId) {
        throw new Error('ID do evento é obrigatório');
      }

      await api.delete(`events/${eventId}`);

    } catch (error) {
      if (error.name === 'ApiError') {
        throw error;
      }
      
      throw new Error(`Erro ao deletar evento: ${error.message}`);
    }
  }
};

export default eventService;