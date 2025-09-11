/**
 * @fileoverview Teste básico para verificar se o servidor Express inicia sem erro
 */

const request = require('supertest');

// Mock do módulo dotenv para testes
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Porta aleatória para testes
process.env.FRONTEND_URL = 'http://localhost:3000';

const app = require('../src/app');

describe('ChurrasApp API - Basic Tests', () => {
  describe('Server Initialization', () => {
    test('should start server without crashing', (done) => {
      // Se chegamos até aqui, o servidor foi importado sem erro
      expect(app).toBeDefined();
      expect(typeof app).toBe('function'); // Express app é uma função
      done();
    });
  });

  describe('Health Check Endpoints', () => {
    test('GET /health should return 200 with status OK', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('meta');
      
      expect(response.body.data).toHaveProperty('status', 'OK');
      expect(response.body.data).toHaveProperty('service', 'ChurrasApp API');
      expect(response.body.data).toHaveProperty('version', '1.0.0');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('timestamp');
      
      expect(response.body.error).toBeNull();
      expect(response.body.meta).toHaveProperty('timestamp');
    });

    test('GET /health/detailed should return detailed system info', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toHaveProperty('status', 'OK');
      expect(response.body.data).toHaveProperty('service', 'ChurrasApp API');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('nodeVersion');
      expect(response.body.data).toHaveProperty('platform');
      expect(response.body.data).toHaveProperty('memory');
      
      expect(response.body.data.memory).toHaveProperty('used');
      expect(response.body.data.memory).toHaveProperty('total');
      expect(typeof response.body.data.memory.used).toBe('number');
      expect(typeof response.body.data.memory.total).toBe('number');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('data', null);
      expect(response.body).toHaveProperty('error', 'Rota não encontrada');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('path', '/non-existent-route');
      expect(response.body.meta).toHaveProperty('method', 'GET');
    });

    test('should handle POST requests to non-existent routes', async () => {
      const response = await request(app)
        .post('/non-existent-route')
        .send({ test: 'data' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Rota não encontrada');
      expect(response.body.meta.method).toBe('POST');
    });
  });

  describe('API Response Format', () => {
    test('should follow standard API response format', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Verificar estrutura padrão: { data, error, meta }
      expect(Object.keys(response.body)).toEqual(['data', 'error', 'meta']);
      
      // Verificar que meta sempre tem timestamp
      expect(response.body.meta).toHaveProperty('timestamp');
      expect(new Date(response.body.meta.timestamp)).toBeInstanceOf(Date);
    });
  });
});
