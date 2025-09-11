/**
 * @fileoverview Servidor principal da aplicação ChurrasApp API
 * Entry point que inicializa o servidor Express
 */

const app = require('./app');

const PORT = process.env.PORT || 3001;

// Iniciar servidor apenas se não estivermos em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
