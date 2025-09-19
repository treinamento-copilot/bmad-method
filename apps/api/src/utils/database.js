/**
 * @fileoverview Configuração e gerenciamento da conexão MongoDB
 * @author Dev Agent James
 */

const mongoose = require('mongoose');

/**
 * Configuração da conexão MongoDB com retry automático
 * @class DatabaseManager
 */
class DatabaseManager {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 segundos
    this.currentRetries = 0;
  }

  /**
   * Conecta ao MongoDB com retry automático
   * @param {string} uri - URI de conexão do MongoDB
   * @returns {Promise<void>}
   */
  async connect(uri = process.env.MONGODB_URI) {
    if (!uri) {
      throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
    }

    try {
      console.log('🔗 Conectando ao MongoDB...');
      
      // Configurações otimizadas do Mongoose
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      };

      this.connection = await mongoose.connect(uri, options);
      this.isConnected = true;
      this.currentRetries = 0;

      console.log(`✅ MongoDB conectado: ${this.connection.connection.name}`);
      console.log(`📍 Host: ${this.connection.connection.host}:${this.connection.connection.port}`);

      // Event listeners para monitoramento da conexão
      this.setupConnectionListeners();

    } catch (error) {
      this.isConnected = false;
      console.error('❌ Erro ao conectar ao MongoDB:', error.message);

      // Retry logic com backoff exponencial
      if (this.currentRetries < this.maxRetries) {
        this.currentRetries++;
        const delay = this.retryDelay * Math.pow(2, this.currentRetries - 1);
        
        console.log(`🔄 Tentativa ${this.currentRetries}/${this.maxRetries} em ${delay/1000}s...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.connect(uri);
      } else {
        throw new Error(`Falha ao conectar ao MongoDB após ${this.maxRetries} tentativas: ${error.message}`);
      }
    }
  }

  /**
   * Configura listeners para eventos da conexão
   * @private
   */
  setupConnectionListeners() {
    // Conexão perdida
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
      this.isConnected = false;
    });

    // Erro na conexão
    mongoose.connection.on('error', (error) => {
      console.error('❌ Erro na conexão MongoDB:', error.message);
      this.isConnected = false;
    });

    // Reconectado
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
      this.isConnected = true;
    });

    // Processo sendo finalizado
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  /**
   * Verifica se a conexão está ativa
   * @returns {boolean}
   */
  isHealthy() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Obtém informações da conexão para health check
   * @returns {Object}
   */
  getConnectionInfo() {
    if (!this.connection) {
      return { status: 'disconnected', details: null };
    }

    return {
      status: this.isConnected ? 'connected' : 'disconnected',
      details: {
        host: this.connection.connection.host,
        port: this.connection.connection.port,
        name: this.connection.connection.name,
        readyState: mongoose.connection.readyState,
        readyStateText: this.getReadyStateText(mongoose.connection.readyState)
      }
    };
  }

  /**
   * Converte código do readyState para texto legível
   * @private
   * @param {number} state - Estado da conexão
   * @returns {string}
   */
  getReadyStateText(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }

  /**
   * Fechamento gracioso da conexão
   * @private
   */
  async gracefulShutdown() {
    console.log('\n🔄 Fechando conexão MongoDB...');
    
    try {
      await mongoose.connection.close();
      console.log('✅ Conexão MongoDB fechada com sucesso');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao fechar conexão MongoDB:', error.message);
      process.exit(1);
    }
  }

  /**
   * Desconecta do MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.connection) {
      await mongoose.connection.close();
      this.isConnected = false;
      this.connection = null;
      console.log('🔌 MongoDB desconectado');
    }
  }
}

// Instância singleton do gerenciador de database
const databaseManager = new DatabaseManager();

module.exports = {
  DatabaseManager,
  connect: databaseManager.connect.bind(databaseManager),
  disconnect: databaseManager.disconnect.bind(databaseManager),
  isHealthy: databaseManager.isHealthy.bind(databaseManager),
  getConnectionInfo: databaseManager.getConnectionInfo.bind(databaseManager)
};