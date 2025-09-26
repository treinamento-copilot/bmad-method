/**
 * @fileoverview Controller para operações de eventos
 * @author Dev Agent James
 */

const Event = require('../models/Event');
const EventItem = require('../models/EventItem');

/**
 * Controller de eventos com validação completa
 */
const eventController = {
  /**
   * Cria um novo evento com itens básicos
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   */
  async createEvent(req, res) {
    try {
      const { name, date, location, estimatedParticipants, items } = req.body;

      // Validação de campos obrigatórios
      if (!name?.trim()) {
        return res.status(400).json({
          data: null,
          error: 'Nome do evento é obrigatório',
          meta: {
            timestamp: new Date().toISOString(),
            field: 'name'
          }
        });
      }

      if (!date) {
        return res.status(400).json({
          data: null,
          error: 'Data do evento é obrigatória',
          meta: {
            timestamp: new Date().toISOString(),
            field: 'date'
          }
        });
      }

      if (!location?.trim()) {
        return res.status(400).json({
          data: null,
          error: 'Local do evento é obrigatório',
          meta: {
            timestamp: new Date().toISOString(),
            field: 'location'
          }
        });
      }

      if (!estimatedParticipants || estimatedParticipants < 1) {
        return res.status(400).json({
          data: null,
          error: 'Número de participantes deve ser pelo menos 1',
          meta: {
            timestamp: new Date().toISOString(),
            field: 'estimatedParticipants'
          }
        });
      }

      // Valida formato da data
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({
          data: null,
          error: 'Data do evento inválida',
          meta: {
            timestamp: new Date().toISOString(),
            field: 'date'
          }
        });
      }

      // Valida se a data é no futuro (permite hoje)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        return res.status(400).json({
          data: null,
          error: 'Data do evento deve ser hoje ou no futuro',
          meta: {
            timestamp: new Date().toISOString(),
            field: 'date'
          }
        });
      }

      // Cria o evento
      const eventData = {
        name: name.trim(),
        date: new Date(date),
        location: location.trim(),
        estimatedParticipants: parseInt(estimatedParticipants)
      };

      const event = await Event.createEvent(eventData);

      // Cria itens básicos se fornecidos
      let createdItems = [];
      if (items && Array.isArray(items) && items.length > 0) {
        const itemsData = items.map(item => ({
          ...item,
          eventId: event.id
        }));

        try {
          createdItems = await EventItem.insertMany(itemsData);
        } catch (itemError) {
          console.warn('Erro ao criar itens do evento:', itemError);
          // Continua mesmo se não conseguir criar os itens
        }
      }

      // Resposta com evento e itens criados
      const responseData = {
        ...event.toObject(),
        items: createdItems
      };

      res.status(201).json({
        data: responseData,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          created: true,
          itemsCount: createdItems.length
        }
      });

    } catch (error) {
      console.error('Erro ao criar evento:', error);

      // Trata erros de validação do Mongoose
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));

        return res.status(400).json({
          data: null,
          error: 'Dados inválidos',
          meta: {
            timestamp: new Date().toISOString(),
            validationErrors
          }
        });
      }

      // Erro interno do servidor
      res.status(500).json({
        data: null,
        error: 'Erro interno do servidor ao criar evento',
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Busca um evento pelo ID
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   */
  async getEvent(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          data: null,
          error: 'ID do evento é obrigatório',
          meta: {
            timestamp: new Date().toISOString()
          }
        });
      }

      const event = await Event.findWithRelations(id);

      if (!event) {
        return res.status(404).json({
          data: null,
          error: 'Evento não encontrado',
          meta: {
            timestamp: new Date().toISOString(),
            eventId: id
          }
        });
      }

      res.status(200).json({
        data: event,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          guestCount: event.guestCount || 0,
          itemCount: event.items?.length || 0
        }
      });

    } catch (error) {
      console.error('Erro ao buscar evento:', error);

      res.status(500).json({
        data: null,
        error: 'Erro interno do servidor ao buscar evento',
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Atualiza um evento
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   */
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          data: null,
          error: 'ID do evento é obrigatório',
          meta: {
            timestamp: new Date().toISOString()
          }
        });
      }

      const event = await Event.updateByPublicId(id, updateData);

      if (!event) {
        return res.status(404).json({
          data: null,
          error: 'Evento não encontrado',
          meta: {
            timestamp: new Date().toISOString(),
            eventId: id
          }
        });
      }

      res.status(200).json({
        data: event,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          updated: true
        }
      });

    } catch (error) {
      console.error('Erro ao atualizar evento:', error);

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));

        return res.status(400).json({
          data: null,
          error: 'Dados inválidos',
          meta: {
            timestamp: new Date().toISOString(),
            validationErrors
          }
        });
      }

      res.status(500).json({
        data: null,
        error: 'Erro interno do servidor ao atualizar evento',
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Lista eventos (para futuro uso)
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   */
  async listEvents(req, res) {
    try {
      const { status, limit = 10, offset = 0 } = req.query;

      const filter = {};
      if (status) filter.status = status;

      const events = await Event.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));

      const total = await Event.countDocuments(filter);

      res.status(200).json({
        data: events,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total
        }
      });

    } catch (error) {
      console.error('Erro ao listar eventos:', error);

      res.status(500).json({
        data: null,
        error: 'Erro interno do servidor ao listar eventos',
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Deleta um evento (soft delete)
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   */
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          data: null,
          error: 'ID do evento é obrigatório',
          meta: {
            timestamp: new Date().toISOString()
          }
        });
      }

      const event = await Event.deleteByPublicId(id);

      if (!event) {
        return res.status(404).json({
          data: null,
          error: 'Evento não encontrado',
          meta: {
            timestamp: new Date().toISOString(),
            eventId: id
          }
        });
      }

      res.status(200).json({
        data: { id, status: 'cancelled' },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          deleted: true
        }
      });

    } catch (error) {
      console.error('Erro ao deletar evento:', error);

      res.status(500).json({
        data: null,
        error: 'Erro interno do servidor ao deletar evento',
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    }
  }
};

module.exports = eventController;