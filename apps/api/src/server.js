/**
 * @fileoverview Servidor principal da aplicação ChurrasApp API
 * Entry point que inicializa o servidor Express e conexão MongoDB
 */

require('dotenv').config();
const app = require('./app');
const { connectDatabase, disconnectDatabase } = require('./utils/database');

const PORT = process.env.PORT || 3001;

/**
 * Inicialização do servidor com MongoDB
 */
async function startServer() {
  try {
    // Conectar ao MongoDB primeiro
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Iniciar servidor HTTP apenas após conexão com DB
    if (process.env.NODE_ENV !== 'test') {
      const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️ Database: ${process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@') || 'Not configured'}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', async () => {
        console.log('🛑 SIGTERM received. Shutting down gracefully...');
        await gracefulShutdown(server);
      });

      process.on('SIGINT', async () => {
        console.log('🛑 SIGINT received. Shutting down gracefully...');
        await gracefulShutdown(server);
      });
    }
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown do servidor
 * @param {import('http').Server} server 
 */
async function gracefulShutdown(server) {
  console.log('🔌 Closing server connections...');
  
  server.close(async () => {
    console.log('🚪 HTTP server closed');
    
    try {
      await disconnectDatabase();
      console.log('✅ Database disconnected');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error.message);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⏰ Shutdown timeout. Forcing exit...');
    process.exit(1);
  }, 10000);
}

// Iniciar servidor apenas se não estivermos em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
