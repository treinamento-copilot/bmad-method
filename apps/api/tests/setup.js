/**
 * @fileoverview Setup para testes Jest no backend
 * Inclui configuração do MongoDB Memory Server
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Configurar timeout padrão para testes
jest.setTimeout(30000);

// Mock de console.log para testes mais limpos
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(async () => {
  // Silenciar logs durante testes, exceto errors importantes
  console.log = jest.fn();
  console.error = jest.fn();
  
  // Inicializar MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.PORT = '0';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  process.env.MONGODB_URI = mongoUri;
  
  // Conectar ao MongoDB de teste
  await mongoose.connect(mongoUri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false
  });
});

afterAll(async () => {
  // Restaurar console original
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  
  // Desconectar do MongoDB e parar servidor
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Limpar collections antes de cada teste
beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Utilitários para testes
global.testUtils = {
  /**
   * Gera dados de teste para Event
   * @param {Object} overrides 
   * @returns {Object}
   */
  createEventData: (overrides = {}) => ({
    name: 'Churrasco de Teste',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
    location: 'Casa do João, Rua das Flores, 123',
    estimatedParticipants: 10,
    confirmationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias no futuro
    ...overrides
  }),

  /**
   * Gera dados de teste para Guest
   * @param {string} eventId 
   * @param {Object} overrides 
   * @returns {Object}
   */
  createGuestData: (eventId, overrides = {}) => ({
    eventId,
    name: 'João Silva',
    phone: '(11) 99999-9999',
    rsvpStatus: 'pending',
    paymentStatus: 'pending',
    ...overrides
  }),

  /**
   * Gera dados de teste para EventItem
   * @param {string} eventId 
   * @param {Object} overrides 
   * @returns {Object}
   */
  createEventItemData: (eventId, overrides = {}) => ({
    eventId,
    name: 'Picanha',
    category: 'carne',
    quantity: 2,
    unit: 'kg',
    estimatedCost: 80.00,
    ...overrides
  })
};
