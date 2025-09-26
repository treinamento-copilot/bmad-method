/**
 * @fileoverview Service layer para operações de eventos
 * @author Dev Agent
 */

/**
 * Configuração base da API
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Cliente HTTP básico com tratamento de erro
 * @param {string} url - URL da requisição
 * @param {Object} options - Opções da requisição
 * @returns {Promise<Object>} Resposta da API
 * @throws {Error} Erro da API ou de rede
 */
const apiClient = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro HTTP: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição API:', error);
    throw error;
  }
};

/**
 * Service para operações de eventos
 */
export const eventService = {
  /**
   * Cria um novo evento
   * @param {Object} eventData - Dados do evento
   * @param {string} eventData.name - Nome do evento
   * @param {string} eventData.date - Data do evento (ISO string)
   * @param {string} eventData.location - Local do evento
   * @param {number} eventData.estimatedParticipants - Número estimado de participantes
   * @returns {Promise<Object>} Evento criado com ID gerado
   * @throws {Error} Erro de validação ou servidor
   */
  async createEvent(eventData) {
    try {
      // Validação básica dos dados obrigatórios
      if (!eventData.name || !eventData.date || !eventData.location || !eventData.estimatedParticipants) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos: nome, data, local e número de participantes.');
      }

      // Validar se a data é no futuro
      const eventDate = new Date(eventData.date);
      if (eventDate <= new Date()) {
        throw new Error('A data do evento deve ser no futuro.');
      }

      // Validar número de participantes
      if (eventData.estimatedParticipants < 1 || eventData.estimatedParticipants > 50) {
        throw new Error('O número de participantes deve estar entre 1 e 50.');
      }

      const response = await apiClient('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });

      return response;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error(`Falha ao criar evento: ${error.message}`);
    }
  },

  /**
   * Busca um evento por ID
   * @param {string} eventId - ID do evento
   * @returns {Promise<Object>} Dados do evento
   * @throws {Error} Erro se evento não encontrado
   */
  async getEvent(eventId) {
    try {
      if (!eventId) {
        throw new Error('ID do evento é obrigatório.');
      }

      const response = await apiClient(`/events/${eventId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      throw new Error(`Falha ao buscar evento: ${error.message}`);
    }
  },

  /**
   * Lista eventos de um organizador
   * @param {string} organizerId - ID do organizador (opcional)
   * @returns {Promise<Array>} Lista de eventos
   * @throws {Error} Erro de servidor
   */
  async listEvents(organizerId = null) {
    try {
      const url = organizerId ? `/events?organizerId=${organizerId}` : '/events';
      const response = await apiClient(url);
      return response;
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      throw new Error(`Falha ao listar eventos: ${error.message}`);
    }
  }
};

export default eventService;