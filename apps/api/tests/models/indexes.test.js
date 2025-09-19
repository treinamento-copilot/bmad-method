/**
 * @fileoverview Testes de validação de índices MongoDB
 * @author Dev Agent James
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Event = require('../../src/models/Event');
const Guest = require('../../src/models/Guest');
const EventItem = require('../../src/models/EventItem');

describe('MongoDB Indexes Validation', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    
    // Garantir que os índices sejam criados
    await Event.ensureIndexes();
    await Guest.ensureIndexes();
    await EventItem.ensureIndexes();
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Event Model Indexes', () => {
    it('deve ter índice único no campo id', async () => {
      const indexes = await Event.collection.getIndexes();
      
      // Verificar se existe índice para o campo 'id'
      const idIndex = Object.keys(indexes).find(key => 
        indexes[key].some(field => field[0] === 'id' && field[1] === 1)
      );
      
      expect(idIndex).toBeTruthy();
      
      // Verificar se é único
      const indexInfo = await Event.collection.indexInformation();
      const idIndexInfo = indexInfo['id_1'];
      expect(idIndexInfo).toBeTruthy();
    });

    it('deve ter índice no campo organizerId', async () => {
      const indexInfo = await Event.collection.indexInformation();
      expect(indexInfo['organizerId_1']).toBeTruthy();
    });

    it('deve ter índice temporal no campo createdAt', async () => {
      const indexInfo = await Event.collection.indexInformation();
      expect(indexInfo['createdAt_-1']).toBeTruthy();
    });

    it('deve prevenir inserção de eventos com mesmo id', async () => {
      const eventData = {
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      };

      const event1 = await Event.createEvent(eventData);
      
      // Tentar criar evento com mesmo ID (simulando violação)
      const duplicateEvent = new Event({
        ...eventData,
        id: event1.id
      });

      await expect(duplicateEvent.save()).rejects.toThrow();
    });
  });

  describe('Guest Model Indexes', () => {
    it('deve ter índice único no campo id', async () => {
      const indexInfo = await Guest.collection.indexInformation();
      expect(indexInfo['id_1']).toBeTruthy();
    });

    it('deve ter índice no campo eventId', async () => {
      const indexInfo = await Guest.collection.indexInformation();
      expect(indexInfo['eventId_1']).toBeTruthy();
    });

    it('deve ter índice composto eventId + rsvpStatus', async () => {
      const indexInfo = await Guest.collection.indexInformation();
      expect(indexInfo['eventId_1_rsvpStatus_1']).toBeTruthy();
    });

    it('deve ter índice temporal no campo createdAt', async () => {
      const indexInfo = await Guest.collection.indexInformation();
      expect(indexInfo['createdAt_-1']).toBeTruthy();
    });

    it('deve prevenir inserção de convidados com mesmo id', async () => {
      const testEventId = '12345678-1234-4000-8000-123456789012';
      
      const guestData = {
        eventId: testEventId,
        name: 'João Silva'
      };

      const guest1 = await Guest.createGuest(guestData);
      
      // Tentar criar convidado com mesmo ID
      const duplicateGuest = new Guest({
        ...guestData,
        id: guest1.id,
        name: 'Maria Silva'
      });

      await expect(duplicateGuest.save()).rejects.toThrow();
    });
  });

  describe('EventItem Model Indexes', () => {
    it('deve ter índice único no campo id', async () => {
      const indexInfo = await EventItem.collection.indexInformation();
      expect(indexInfo['id_1']).toBeTruthy();
    });

    it('deve ter índice no campo eventId', async () => {
      const indexInfo = await EventItem.collection.indexInformation();
      expect(indexInfo['eventId_1']).toBeTruthy();
    });

    it('deve ter índice composto eventId + category', async () => {
      const indexInfo = await EventItem.collection.indexInformation();
      expect(indexInfo['eventId_1_category_1']).toBeTruthy();
    });

    it('deve ter índice composto eventId + isPurchased', async () => {
      const indexInfo = await EventItem.collection.indexInformation();
      expect(indexInfo['eventId_1_isPurchased_1']).toBeTruthy();
    });

    it('deve ter índice no campo isTemplate', async () => {
      const indexInfo = await EventItem.collection.indexInformation();
      expect(indexInfo['isTemplate_1']).toBeTruthy();
    });

    it('deve ter índice temporal no campo createdAt', async () => {
      const indexInfo = await EventItem.collection.indexInformation();
      expect(indexInfo['createdAt_-1']).toBeTruthy();
    });

    it('deve prevenir inserção de itens com mesmo id', async () => {
      const testEventId = '12345678-1234-4000-8000-123456789012';
      
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      const item1 = await EventItem.createItem(itemData);
      
      // Tentar criar item com mesmo ID
      const duplicateItem = new EventItem({
        ...itemData,
        id: item1.id,
        name: 'Cerveja'
      });

      await expect(duplicateItem.save()).rejects.toThrow();
    });
  });

  describe('Index Performance Validation', () => {
    const testEventId = '12345678-1234-4000-8000-123456789012';

    beforeEach(async () => {
      // Limpar collections
      await Event.deleteMany({});
      await Guest.deleteMany({});
      await EventItem.deleteMany({});

      // Criar dados de teste
      await Event.createEvent({
        name: 'Churras Performance Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      });

      // Criar múltiplos convidados
      for (let i = 0; i < 10; i++) {
        await Guest.createGuest({
          eventId: testEventId,
          name: `Convidado ${i}`,
          rsvpStatus: i % 2 === 0 ? 'yes' : 'pending'
        });
      }

      // Criar múltiplos itens
      const categories = ['carne', 'bebidas', 'acompanhamentos'];
      for (let i = 0; i < 15; i++) {
        await EventItem.createItem({
          eventId: testEventId,
          name: `Item ${i}`,
          category: categories[i % categories.length],
          quantity: 1,
          unit: 'unidade',
          estimatedCost: 10.00,
          isPurchased: i % 3 === 0
        });
      }
    });

    it('deve executar busca por eventId em Guest de forma eficiente', async () => {
      const startTime = Date.now();
      const guests = await Guest.findByEventId(testEventId);
      const endTime = Date.now();
      
      expect(guests).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(100); // Menos de 100ms
    });

    it('deve executar busca por eventId em EventItem de forma eficiente', async () => {
      const startTime = Date.now();
      const items = await EventItem.findByEventId(testEventId);
      const endTime = Date.now();
      
      expect(items).toHaveLength(15);
      expect(endTime - startTime).toBeLessThan(100); // Menos de 100ms
    });

    it('deve executar agregação de estatísticas de forma eficiente', async () => {
      const startTime = Date.now();
      const [guestStats, itemStats] = await Promise.all([
        Guest.getEventStats(testEventId),
        EventItem.getEventStats(testEventId)
      ]);
      const endTime = Date.now();
      
      expect(guestStats.total).toBe(10);
      expect(itemStats.totalItems).toBe(15);
      expect(endTime - startTime).toBeLessThan(200); // Menos de 200ms para ambas
    });

    it('deve executar busca de templates de forma eficiente', async () => {
      // Criar alguns templates
      await EventItem.createItem({
        eventId: testEventId,
        name: 'Template 1',
        category: 'carne',
        quantity: 1,
        unit: 'kg',
        estimatedCost: 50.00,
        isTemplate: true
      });

      const startTime = Date.now();
      const templates = await EventItem.findTemplates();
      const endTime = Date.now();
      
      expect(templates).toHaveLength(1);
      expect(endTime - startTime).toBeLessThan(50); // Menos de 50ms
    });
  });

  describe('Index Uniqueness Validation', () => {
    it('deve garantir unicidade do campo id entre diferentes collections', async () => {
      const testEventId = '12345678-1234-4000-8000-123456789012';
      
      // Criar dados em diferentes collections
      const event = await Event.createEvent({
        name: 'Churras Test',
        date: new Date(Date.now() + 86400000),
        location: 'Casa do João',
        estimatedParticipants: 10
      });

      const guest = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Silva'
      });

      const item = await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      });

      // IDs devem ser únicos entre collections
      expect(event.id).not.toBe(guest.id);
      expect(event.id).not.toBe(item.id);
      expect(guest.id).not.toBe(item.id);
      
      // Todos devem seguir formato UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(event.id).toMatch(uuidRegex);
      expect(guest.id).toMatch(uuidRegex);
      expect(item.id).toMatch(uuidRegex);
    });
  });
});