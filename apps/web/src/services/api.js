/**
 * Cliente HTTP base para comunicação com a API
 * Centraliza configuração e tratamento de erros
 */

// URL base da API - obtida das variáveis de ambiente
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Classe de erro customizada para erros de API
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Configurações padrão para requisições
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Processa resposta da API e trata erros
 * @param {Response} response - Resposta do fetch
 * @returns {Promise<any>} Dados da resposta ou rejeita com ApiError
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = null;

  // Tenta fazer parse do JSON se o conteúdo for JSON
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (error) {
      // Se não conseguir fazer parse do JSON, usa texto
      data = { message: await response.text() };
    }
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || `HTTP Error: ${response.status}`,
      response.status,
      data
    );
  }

  return data;
};

/**
 * Realiza requisição HTTP
 * @param {string} endpoint - Endpoint da API (sem barra inicial)
 * @param {Object} options - Opções da requisição
 * @returns {Promise<any>} Dados da resposta
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Erro de rede ou outro erro não esperado
    throw new ApiError(
      error.message || 'Erro de conexão com o servidor',
      0,
      null
    );
  }
};

/**
 * Cliente HTTP com métodos de conveniência
 */
export const api = {
  /**
   * Requisição GET
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções adicionais
   * @returns {Promise<any>} Dados da resposta
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'GET'
    });
  },

  /**
   * Requisição POST
   * @param {string} endpoint - Endpoint da API
   * @param {any} data - Dados para enviar no body
   * @param {Object} options - Opções adicionais
   * @returns {Promise<any>} Dados da resposta
   */
  post: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null
    });
  },

  /**
   * Requisição PUT
   * @param {string} endpoint - Endpoint da API
   * @param {any} data - Dados para enviar no body
   * @param {Object} options - Opções adicionais
   * @returns {Promise<any>} Dados da resposta
   */
  put: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null
    });
  },

  /**
   * Requisição PATCH
   * @param {string} endpoint - Endpoint da API
   * @param {any} data - Dados para enviar no body
   * @param {Object} options - Opções adicionais
   * @returns {Promise<any>} Dados da resposta
   */
  patch: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null
    });
  },

  /**
   * Requisição DELETE
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções adicionais
   * @returns {Promise<any>} Dados da resposta
   */
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
};

export default api;