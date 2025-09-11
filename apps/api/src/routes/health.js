/**
 * @fileoverview Rota de health check para verificação de status da API
 */

const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * @route GET /health
 * @returns {Object} Status da API
 */
router.get('/', (req, res) => {
  res.status(200).json({
    data: {
      status: 'OK',
      service: 'ChurrasApp API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'no-id'
    }
  });
});

/**
 * Detailed health check with system info
 * @route GET /health/detailed
 * @returns {Object} Status detalhado da API
 */
router.get('/detailed', (req, res) => {
  res.status(200).json({
    data: {
      status: 'OK',
      service: 'ChurrasApp API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    },
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'no-id'
    }
  });
});

module.exports = router;
