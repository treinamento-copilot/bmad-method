/**
 * @fileoverview Testes do modelo Event
 * @author Dev Agent James
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Event = require('../../src/models/Event');

describe('Event Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Event.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('deve criar evento com dados válidos', async () => {
      const eventData = {
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000), // Tomorrow
        location: 'Casa do João',
        estimatedParticipants: 10
      };

      const event = await Event.createEvent(eventData);
      
      expect(event).toBeTruthy();
      expect(event.name).toBe(eventData.name);
      expect(event.status).toBe('draft'); // Default
      expect(event.id).toBeTruthy();
      expect(event.organizerId).toBeTruthy();
    });

    it('deve rejeitar evento sem nome', async () => {
      const eventData = {
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      };

      await expect(Event.createEvent(eventData)).rejects.toThrow();
    });

    it('deve rejeitar evento com data no passado', async () => {
      const eventData = {
        name: 'Churras Test',
        date: new Date(Date.now() - 86400000), // Yesterday
        location: 'Casa do João',
        estimatedParticipants: 10
      };

      await expect(Event.createEvent(eventData)).rejects.toThrow();
    });

    it('deve validar enum de status', async () => {
      const eventData = {
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10,
        status: 'invalid_status'
      };

      await expect(Event.createEvent(eventData)).rejects.toThrow();
    });

    it('deve validar limites de participantes', async () => {
      const eventData = {
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 100 // Acima do limite
      };

      await expect(Event.createEvent(eventData)).rejects.toThrow();
    });
  });

  describe('CRUD Methods', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await Event.createEvent({
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      });
    });

    it('deve buscar evento por ID público', async () => {
      const found = await Event.findByPublicId(testEvent.id);
      
      expect(found).toBeTruthy();
      expect(found.id).toBe(testEvent.id);
      expect(found.name).toBe(testEvent.name);
    });

    it('deve atualizar evento por ID público', async () => {
      const updateData = {
        name: 'Churras Atualizado',
        estimatedParticipants: 15
      };

      const updated = await Event.updateByPublicId(testEvent.id, updateData);
      
      expect(updated).toBeTruthy();
      expect(updated.name).toBe(updateData.name);
      expect(updated.estimatedParticipants).toBe(updateData.estimatedParticipants);
      expect(updated.id).toBe(testEvent.id); // ID não deve mudar
    });

    it('deve fazer soft delete (cancelar evento)', async () => {
      const cancelled = await Event.deleteByPublicId(testEvent.id);
      
      expect(cancelled).toBeTruthy();
      expect(cancelled.status).toBe('cancelled');
      expect(cancelled.id).toBe(testEvent.id);
    });

    it('deve retornar null para ID inexistente', async () => {
      const nonExistent = await Event.findByPublicId('00000000-0000-4000-8000-000000000000');
      expect(nonExistent).toBeNull();
    });
  });

  describe('Virtual Properties', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await Event.createEvent({
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000 * 5), // 5 days from now
        location: 'Casa do João',
        estimatedParticipants: 10
      });
    });

    it('deve calcular dias até o evento', () => {
      const days = testEvent.daysUntilEvent;
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(5);
    });

    it('deve verificar se confirmações estão abertas', () => {
      expect(testEvent.isConfirmationOpen).toBe(true);
    });
  });

  describe('Instance Methods', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await Event.createEvent({
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      });
    });

    it('deve verificar se evento pode ser editado', () => {
      expect(testEvent.canBeEdited()).toBe(true);
    });

    it('deve verificar se evento pode ser cancelado', () => {
      expect(testEvent.canBeCancelled()).toBe(true);
    });
  });

  describe('UUID Generation', () => {
    it('deve gerar UUIDs únicos para eventos diferentes', async () => {
      const event1 = await Event.createEvent({
        name: 'Churras 1',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      });

      const event2 = await Event.createEvent({
        name: 'Churras 2',
        date: new Date(Date.now() + 86400000 * 2),
        location: 'Casa da Maria',
        estimatedParticipants: 15
      });

      expect(event1.id).not.toBe(event2.id);
      expect(event1.organizerId).not.toBe(event2.organizerId);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(event1.id).toMatch(uuidRegex);
      expect(event2.id).toMatch(uuidRegex);
    });
  });
});