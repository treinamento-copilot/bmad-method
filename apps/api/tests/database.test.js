/**
 * @fileoverview Testes da conexão MongoDB
 * @author Dev Agent James
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const { connect, disconnect, isHealthy, getConnectionInfo } = require('../src/utils/database');

describe('Database Connection', () => {
  let mongoServer;
  let mongoUri;

  // Setup MongoDB Memory Server
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
  }, 20000);

  // Cleanup
  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    try {
      await disconnect();
    } catch (error) {
      // Ignorar erros de desconexão nos testes
    }
  });

  describe('connect()', () => {
    it('deve conectar ao MongoDB com URI válida', async () => {
      await expect(connect(mongoUri)).resolves.not.toThrow();
      expect(isHealthy()).toBe(true);
    }, 10000);

    it('deve falhar com URI inválida', async () => {
      const invalidUri = 'mongodb://invalid-host:27017/test';
      
      await expect(connect(invalidUri)).rejects.toThrow();
      expect(isHealthy()).toBe(false);
    }, 20000);

    it('deve falhar sem MONGODB_URI', async () => {
      // Remover temporariamente a variável de ambiente
      const originalUri = process.env.MONGODB_URI;
      delete process.env.MONGODB_URI;
      
      await expect(connect()).rejects.toThrow('MONGODB_URI não está definido');
      
      // Restaurar variável de ambiente
      process.env.MONGODB_URI = originalUri;
    });
  });

  describe('getConnectionInfo()', () => {
    it('deve retornar status disconnected quando não conectado', () => {
      const info = getConnectionInfo();
      expect(info.status).toBe('disconnected');
      expect(info.details).toBeNull();
    });

    it('deve retornar informações detalhadas quando conectado', async () => {
      await connect(mongoUri);
      
      const info = getConnectionInfo();
      expect(info.status).toBe('connected');
      expect(info.details).toHaveProperty('host');
      expect(info.details).toHaveProperty('port');
      expect(info.details).toHaveProperty('name');
      expect(info.details).toHaveProperty('readyState', 1);
    }, 10000);
  });

  describe('isHealthy()', () => {
    it('deve retornar false quando não conectado', () => {
      expect(isHealthy()).toBe(false);
    });

    it('deve retornar true quando conectado', async () => {
      await connect(mongoUri);
      
      expect(isHealthy()).toBe(true);
    }, 10000);
  });

  describe('disconnect()', () => {
    it('deve desconectar sem erro mesmo se não conectado', async () => {
      await expect(disconnect()).resolves.not.toThrow();
    });

    it('deve desconectar corretamente quando conectado', async () => {
      await connect(mongoUri);
      expect(isHealthy()).toBe(true);
      
      await disconnect();
      expect(isHealthy()).toBe(false);
    }, 10000);
  });
});