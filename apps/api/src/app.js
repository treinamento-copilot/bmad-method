/**
 * @fileoverview Configuração do Express app (sem inicialização do servidor)
 * Para permitir testes sem conflitos de porta
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', require('./routes/health'));
app.use('/api/events', require('./routes/events'));

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    data: null,
    error: 'Erro interno do servidor',
    meta: {
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    data: null,
    error: 'Rota não encontrada',
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
});

/**
 * Exporta a instância do Express app para ser utilizada em testes
 * ou para inicialização do servidor em outro arquivo.
 */
module.exports = app;
