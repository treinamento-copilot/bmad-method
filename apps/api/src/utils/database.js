const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Configuração de conexão MongoDB com retry automático
 * Implementa estratégia de reconexão conforme error-handling-strategy.md
 */

const RECONNECT_INTERVAL = 5000; // 5 segundos
const MAX_RECONNECT_ATTEMPTS = 5;

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.connectionPromise = null;
  }

  /**
   * Conecta ao MongoDB com retry automático
   * @returns {Promise<mongoose.Connection>}
   */
  async connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._connectWithRetry();
    return this.connectionPromise;
  }

  /**
   * Implementa conexão com retry e backoff exponencial
   * @private
   */
  async _connectWithRetry() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    const connectionOptions = {
      maxPoolSize: 10, // Maximum connections in pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
      bufferCommands: false // Disable command buffering
    };

    try {
      console.log('🔌 Connecting to MongoDB...', {
        uri: mongoUri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials in logs
        options: connectionOptions
      });

      await mongoose.connect(mongoUri, connectionOptions);
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('✅ Connected to MongoDB successfully');
      
      // Setup connection event listeners
      this._setupEventListeners();
      
      return mongoose.connection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', {
        error: error.message,
        attempt: this.reconnectAttempts + 1,
        maxAttempts: MAX_RECONNECT_ATTEMPTS
      });

      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('💥 Max reconnection attempts reached. Giving up.');
        throw new Error(`Failed to connect to MongoDB after ${MAX_RECONNECT_ATTEMPTS} attempts: ${error.message}`);
      }

      // Backoff exponencial: 5s, 10s, 20s, 40s, 80s
      const delay = RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`⏳ Retrying connection in ${delay}ms...`);
      
      await this._delay(delay);
      return this._connectWithRetry();
    }
  }

  /**
   * Setup event listeners para monitorar conexão
   * @private
   */
  _setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📡 Mongoose disconnected from MongoDB');
      this.isConnected = false;
      
      // Auto-reconnect se não foi um shutdown intencional
      if (!this.isShuttingDown) {
        console.log('🔄 Attempting to reconnect...');
        this.reconnectAttempts = 0;
        this.connectionPromise = null;
        this.connect().catch(error => {
          console.error('💥 Auto-reconnection failed:', error.message);
        });
      }
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ Mongoose reconnected to MongoDB');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });
  }

  /**
   * Desconecta do MongoDB gracefully
   */
  async disconnect() {
    this.isShuttingDown = true;
    
    if (mongoose.connection.readyState !== 0) {
      console.log('🔌 Disconnecting from MongoDB...');
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
    }
    
    this.isConnected = false;
    this.connectionPromise = null;
  }

  /**
   * Verifica se está conectado
   * @returns {boolean}
   */
  isReady() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Delay utility para retry logic
   * @param {number} ms 
   * @returns {Promise}
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
const dbConnection = new DatabaseConnection();

/**
 * Inicializa conexão MongoDB
 * @returns {Promise<mongoose.Connection>}
 */
const connectDatabase = async () => {
  return await dbConnection.connect();
};

/**
 * Desconecta do MongoDB
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
  return await dbConnection.disconnect();
};

/**
 * Verifica se database está conectado
 * @returns {boolean}
 */
const isDatabaseReady = () => {
  return dbConnection.isReady();
};

/**
 * Gera UUID v4 único
 * @returns {string}
 */
const generateUniqueId = () => {
  return uuidv4();
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  isDatabaseReady,
  generateUniqueId,
  mongoose
};