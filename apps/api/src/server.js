/**
 * @fileoverview Servidor principal da aplicação ChurrasApp API
 * Entry point que inicializa o servidor Express e conexão MongoDB
 */

const app = require('./app');
const { connect } = require('./utils/database');

const PORT = process.env.PORT || 3001;

/**
 * Inicializa o servidor e conexão com banco de dados
 */
async function startServer() {
  try {
    // Conectar ao MongoDB antes de iniciar o servidor
    await connect();
    
    // Iniciar servidor apenas se não estivermos em ambiente de teste
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📋 Acesse http://localhost:${PORT}/health para verificar status`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error.message);
    process.exit(1);
  }
}

// Iniciar servidor apenas se não estivermos em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
