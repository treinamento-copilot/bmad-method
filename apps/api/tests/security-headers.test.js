/**
 * @fileoverview Teste dos headers de segurança implementados com Helmet
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

describe('Security Headers - Helmet Configuration', () => {
  describe('Basic Security Headers', () => {
    test('should include X-Content-Type-Options header', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    test('should include X-Frame-Options header', async () => {
      const response = await request(app)
        .get('/health');

      // Configurado para DENY para máxima segurança
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    test('should include X-XSS-Protection header', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['x-xss-protection']).toBe('0');
    });

    test('should include Referrer-Policy header', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['referrer-policy']).toBe('same-origin');
    });

    test('should include Strict-Transport-Security header', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['strict-transport-security']).toMatch(/max-age=31536000/);
      expect(response.headers['strict-transport-security']).toMatch(/includeSubDomains/);
      expect(response.headers['strict-transport-security']).toMatch(/preload/);
    });
  });

  describe('Content Security Policy', () => {
    test('should include Content-Security-Policy header', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['content-security-policy']).toBeDefined();
      
      const csp = response.headers['content-security-policy'];
      
      // Verificar diretivas principais
      expect(csp).toMatch(/default-src 'self'/);
      expect(csp).toMatch(/script-src 'self' 'unsafe-inline'/);
      expect(csp).toMatch(/style-src 'self' 'unsafe-inline'/);
      expect(csp).toMatch(/object-src 'none'/);
      expect(csp).toMatch(/frame-src 'none'/);
    });

    test('CSP should allow images from any source (permissive)', async () => {
      const response = await request(app)
        .get('/health');

      const csp = response.headers['content-security-policy'];
      expect(csp).toMatch(/img-src 'self' data: https: \*/);
    });

    test('CSP should restrict connections to self only', async () => {
      const response = await request(app)
        .get('/health');

      const csp = response.headers['content-security-policy'];
      expect(csp).toMatch(/connect-src 'self'/);
    });
  });

  describe('No CORS Policy', () => {
    test('should not include CORS headers', async () => {
      const response = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      // CORS headers não devem estar presentes
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
      
      // Headers de segurança devem estar presentes mesmo em OPTIONS
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('Security Headers on Different Routes', () => {
    test('should include security headers on 404 responses', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    test('should include security headers on API routes', async () => {
      // Testando uma rota da API que pode não existir ainda
      const response = await request(app)
        .get('/api/events');

      // Headers devem estar presentes independente do status
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['content-security-policy']).toBeDefined();
    }, 15000);
  });

  describe('Security Headers Validation', () => {
    test('should not expose sensitive information in headers', async () => {
      const response = await request(app)
        .get('/health');

      // Verificar que headers perigosos não estão presentes
      expect(response.headers['server']).toBeUndefined();
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    test('should have proper HSTS configuration for HTTPS', async () => {
      const response = await request(app)
        .get('/health');

      const hsts = response.headers['strict-transport-security'];
      expect(hsts).toBeDefined();
      
      // 31536000 segundos = 1 ano
      expect(hsts).toContain('max-age=31536000');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });
  });
});