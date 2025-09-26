/**
 * @fileoverview Testes para verificar se os headers de segurança estão sendo aplicados
 */

const request = require('supertest');

// Mock do módulo dotenv para testes
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.FRONTEND_URL = 'http://localhost:3000';

const app = require('../src/app');

describe('Security Headers - Helmet Configuration', () => {
  describe('CSP Headers', () => {
    test('should include Content-Security-Policy header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(503); // Health vai retornar 503 sem DB, mas headers devem estar presentes

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
      expect(response.headers['content-security-policy']).toContain("script-src 'self' 'unsafe-inline'");
      expect(response.headers['content-security-policy']).toContain("style-src 'self' 'unsafe-inline'");
    });
  });

  describe('Security Headers', () => {
    test('should include X-Content-Type-Options header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(503);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    test('should include X-Frame-Options header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(503);

      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    test('should include X-XSS-Protection header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(503);

      expect(response.headers['x-xss-protection']).toBe('0');
    });

    test('should include X-DNS-Prefetch-Control header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(503);

      expect(response.headers['x-dns-prefetch-control']).toBe('off');
    });
  });

  describe('CORS Compatibility', () => {
    test('should work with CORS for allowed origins', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(503);

      // CORS headers devem estar presentes
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      // Headers de segurança também devem estar presentes
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    test('should handle OPTIONS preflight request', async () => {
      const response = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      // Headers de segurança devem estar presentes mesmo em OPTIONS
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });

  describe('Error Handling with Security Headers', () => {
    test('should include security headers in 404 responses', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    test('should include security headers in POST requests', async () => {
      const response = await request(app)
        .post('/non-existent-route')
        .send({ test: 'data' })
        .expect(404);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });
});