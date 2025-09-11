/**
 * @fileoverview Setup para testes Jest no backend
 */

// Configurar timeout padrão para testes
jest.setTimeout(10000);

// Mock de console.log para testes mais limpos
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Silenciar logs durante testes, exceto errors importantes
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restaurar console original
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Mock de variáveis de ambiente padrão para todos os testes
process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.FRONTEND_URL = 'http://localhost:3000';
