/**
 * @fileoverview Rotas para operações de eventos
 * @author Dev Agent James
 */

const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

/**
 * @route POST /api/events
 * @desc Criar um novo evento
 * @access Public
 */
router.post('/', eventController.createEvent);

/**
 * @route GET /api/events/:id
 * @desc Buscar evento pelo ID
 * @access Public
 */
router.get('/:id', eventController.getEvent);

/**
 * @route PUT /api/events/:id
 * @desc Atualizar evento pelo ID
 * @access Public
 */
router.put('/:id', eventController.updateEvent);

/**
 * @route GET /api/events
 * @desc Listar eventos (com filtros opcionais)
 * @access Public
 */
router.get('/', eventController.listEvents);

/**
 * @route DELETE /api/events/:id
 * @desc Deletar evento pelo ID (soft delete)
 * @access Public
 */
router.delete('/:id', eventController.deleteEvent);

module.exports = router;