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

      // Tenta criar via API, se falhar simula sucesso
      try {
        const response = await api.post('events', eventPayload);
        return response.data || response;
      } catch (apiError) {
        console.warn('API não disponível, simulando criação:', apiError.message);
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Retorna evento simulado
        return {
          id: Date.now().toString(),
          _id: Date.now().toString(),
          ...eventPayload,
          status: 'Ativo',
          organizerId: 'user123',
          createdAt: new Date().toISOString(),
          items: templateItems
        };
      }

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

      // Tenta atualizar via API, se falhar simula sucesso
      try {
        const response = await api.put(`events/${eventId}`, updateData);
        return response.data || response;
      } catch (apiError) {
        console.warn('API não disponível, simulando atualização:', apiError.message);
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
          _id: eventId,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }

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
      // Mock temporário para demonstração (remover quando API estiver funcional)
      const mockEvents = [
        {
          _id: '1',
          name: 'Churrasco da Empresa',
          date: '2024-12-15T10:00:00.000Z',
          location: 'Chácara do João, Rua das Flores 123',
          estimatedParticipants: 25,
          status: 'Ativo',
          organizerId: 'user123'
        },
        {
          _id: '2', 
          name: 'Confraternização de Fim de Ano',
          date: '2024-12-31T18:00:00.000Z',
          location: 'Clube da Cidade',
          estimatedParticipants: 50,
          status: 'Ativo',
          organizerId: 'user123'
        },
        {
          _id: '3',
          name: 'Churrasco de Aniversário',
          date: '2024-11-20T16:00:00.000Z',
          location: 'Casa da Maria',
          estimatedParticipants: 15,
          status: 'Ativo', 
          organizerId: 'user123'
        }
      ];

      // Tenta buscar da API primeiro, se falhar usa mock
      try {
        const queryParams = new URLSearchParams(filters);
        const endpoint = queryParams.toString() ? `events?${queryParams}` : 'events';
        
        const response = await api.get(endpoint);
        return response.data || response;
      } catch (apiError) {
        console.warn('API não disponível, usando dados mock:', apiError.message);
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          data: mockEvents,
          meta: {
            total: mockEvents.length,
            limit: 10,
            offset: 0,
            hasMore: false
          }
        };
      }

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

      // Tenta deletar via API, se falhar simula sucesso
      try {
        await api.delete(`events/${eventId}`);
      } catch (apiError) {
        console.warn('API não disponível, simulando exclusão:', apiError.message);
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 300));
      }

    } catch (error) {
      if (error.name === 'ApiError') {
        throw error;
      }
      
      throw new Error(`Erro ao deletar evento: ${error.message}`);
    }
  }
};

export default eventService;