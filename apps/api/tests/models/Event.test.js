/**
 * @fileoverview Testes do modelo Event
 * Testa validações, métodos CRUD e relacionamentos
 */

const Event = require('../../src/models/Event');
const Guest = require('../../src/models/Guest');
const EventItem = require('../../src/models/EventItem');

describe('Event Model', () => {
  describe('Schema Validation', () => {
    test('deve criar um evento válido com dados obrigatórios', async () => {
      const eventData = testUtils.createEventData();
      const event = await Event.createEvent(eventData);

      expect(event.id).toBeDefined();
      expect(event.name).toBe(eventData.name);
      expect(event.date).toEqual(eventData.date);
      expect(event.location).toBe(eventData.location);
      expect(event.estimatedParticipants).toBe(eventData.estimatedParticipants);
      expect(event.status).toBe('draft');
      expect(event.organizerId).toBeDefined();
      expect(event.createdAt).toBeDefined();
      expect(event.updatedAt).toBeDefined();
    });

    test('deve gerar ID único automaticamente', async () => {
      const eventData = testUtils.createEventData();
      const event1 = await Event.createEvent(eventData);
      const event2 = await Event.createEvent(eventData);

      expect(event1.id).toBeDefined();
      expect(event2.id).toBeDefined();
      expect(event1.id).not.toBe(event2.id);
      
      // Verificar formato UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(event1.id)).toBe(true);
      expect(uuidRegex.test(event2.id)).toBe(true);
    });

    test('deve validar campos obrigatórios', async () => {
      const invalidData = {};
      
      await expect(Event.createEvent(invalidData)).rejects.toThrow(/validação/);
    });

    test('deve validar tamanho mínimo e máximo dos campos', async () => {
      // Nome muito curto
      await expect(Event.createEvent(testUtils.createEventData({
        name: 'AB'
      }))).rejects.toThrow(/pelo menos 3 caracteres/);

      // Nome muito longo
      await expect(Event.createEvent(testUtils.createEventData({
        name: 'A'.repeat(101)
      }))).rejects.toThrow(/não pode exceder 100 caracteres/);

      // Local muito curto
      await expect(Event.createEvent(testUtils.createEventData({
        location: 'Casa'
      }))).rejects.toThrow(/pelo menos 5 caracteres/);

      // Local muito longo
      await expect(Event.createEvent(testUtils.createEventData({
        location: 'A'.repeat(201)
      }))).rejects.toThrow(/não pode exceder 200 caracteres/);
    });

    test('deve validar data no futuro', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // ontem
      
      await expect(Event.createEvent(testUtils.createEventData({
        date: pastDate
      }))).rejects.toThrow(/deve ser no futuro/);
    });

    test('deve validar prazo de confirmação antes da data do evento', async () => {
      const eventDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const invalidDeadline = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000); // depois do evento
      
      await expect(Event.createEvent(testUtils.createEventData({
        date: eventDate,
        confirmationDeadline: invalidDeadline
      }))).rejects.toThrow(/antes da data do evento/);
    });

    test('deve validar número de participantes', async () => {
      // Muito baixo
      await expect(Event.createEvent(testUtils.createEventData({
        estimatedParticipants: 0
      }))).rejects.toThrow(/pelo menos 1 participante/);

      // Muito alto
      await expect(Event.createEvent(testUtils.createEventData({
        estimatedParticipants: 51
      }))).rejects.toThrow(/máximo de participantes é 50/);

      // Não inteiro
      await expect(Event.createEvent(testUtils.createEventData({
        estimatedParticipants: 10.5
      }))).rejects.toThrow(/número inteiro/);
    });

    test('deve validar status enum', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      
      // Status válido
      event.status = 'active';
      await expect(event.save()).resolves.toBeTruthy();

      // Status inválido
      event.status = 'invalid';
      await expect(event.save()).rejects.toThrow(/Status deve ser/);
    });
  });

  describe('CRUD Operations', () => {
    test('findByPublicId deve encontrar evento por ID público', async () => {
      const eventData = testUtils.createEventData();
      const createdEvent = await Event.createEvent(eventData);

      const foundEvent = await Event.findByPublicId(createdEvent.id);
      
      expect(foundEvent).toBeTruthy();
      expect(foundEvent.id).toBe(createdEvent.id);
      expect(foundEvent.name).toBe(eventData.name);
    });

    test('findByPublicId deve retornar null para ID não existente', async () => {
      const foundEvent = await Event.findByPublicId('non-existent-id');
      expect(foundEvent).toBeNull();
    });

    test('updateByPublicId deve atualizar evento', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      
      const updateData = {
        name: 'Churrasco Atualizado',
        estimatedParticipants: 15
      };

      const updatedEvent = await Event.updateByPublicId(event.id, updateData);

      expect(updatedEvent.name).toBe(updateData.name);
      expect(updatedEvent.estimatedParticipants).toBe(updateData.estimatedParticipants);
      expect(updatedEvent.id).toBe(event.id); // ID não deve mudar
    });

    test('updateByPublicId não deve permitir alterar campos protegidos', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      const originalId = event.id;
      const originalOrganizerId = event.organizerId;
      
      const updateData = {
        id: 'new-id',
        organizerId: 'new-organizer-id',
        name: 'Nome Atualizado'
      };

      const updatedEvent = await Event.updateByPublicId(event.id, updateData);

      expect(updatedEvent.id).toBe(originalId);
      expect(updatedEvent.organizerId).toBe(originalOrganizerId);
      expect(updatedEvent.name).toBe(updateData.name);
    });

    test('deleteByPublicId deve fazer soft delete (cancelar evento)', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      
      const deletedEvent = await Event.deleteByPublicId(event.id);

      expect(deletedEvent.status).toBe('cancelled');
    });

    test('findByOrganizer deve buscar eventos por organizador', async () => {
      const organizerId = 'test-organizer-id';
      
      // Criar eventos para o organizador
      await Event.createEvent(testUtils.createEventData({ organizerId }));
      await Event.createEvent(testUtils.createEventData({ 
        organizerId,
        name: 'Segundo Evento'
      }));
      
      // Criar evento para outro organizador
      await Event.createEvent(testUtils.createEventData({ 
        organizerId: 'other-organizer',
        name: 'Evento de Outro'
      }));

      const events = await Event.findByOrganizer(organizerId);

      expect(events.length).toBe(2);
      events.forEach(event => {
        expect(event.organizerId).toBe(organizerId);
      });
    });

    test('findByOrganizer deve filtrar por status', async () => {
      const organizerId = 'test-organizer-id';
      
      const event1 = await Event.createEvent(testUtils.createEventData({ organizerId }));
      const event2 = await Event.createEvent(testUtils.createEventData({ 
        organizerId,
        name: 'Segundo Evento'
      }));

      // Ativar um evento
      await Event.updateByPublicId(event1.id, { status: 'active' });

      const activeEvents = await Event.findByOrganizer(organizerId, { status: 'active' });
      const draftEvents = await Event.findByOrganizer(organizerId, { status: 'draft' });

      expect(activeEvents.length).toBe(1);
      expect(activeEvents[0].id).toBe(event1.id);
      expect(draftEvents.length).toBe(1);
      expect(draftEvents[0].id).toBe(event2.id);
    });
  });

  describe('Relationships and Complex Queries', () => {
    test('findWithRelations deve incluir guests e items', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      
      // Criar convidados
      await Guest.createGuest(testUtils.createGuestData(event.id, { name: 'João' }));
      await Guest.createGuest(testUtils.createGuestData(event.id, { 
        name: 'Maria',
        rsvpStatus: 'yes'
      }));

      // Criar itens
      await EventItem.createItem(testUtils.createEventItemData(event.id, { name: 'Picanha' }));
      await EventItem.createItem(testUtils.createEventItemData(event.id, { 
        name: 'Cerveja',
        category: 'bebidas',
        isPurchased: true
      }));

      const eventWithRelations = await Event.findWithRelations(event.id);

      expect(eventWithRelations).toBeTruthy();
      expect(eventWithRelations.guests).toHaveLength(2);
      expect(eventWithRelations.items).toHaveLength(2);
      expect(eventWithRelations.stats).toBeDefined();
      expect(eventWithRelations.stats.totalGuests).toBe(2);
      expect(eventWithRelations.stats.confirmedGuests).toBe(1);
      expect(eventWithRelations.stats.pendingGuests).toBe(1);
      expect(eventWithRelations.stats.totalItems).toBe(2);
      expect(eventWithRelations.stats.purchasedItems).toBe(1);
    });

    test('findWithRelations deve retornar null para evento inexistente', async () => {
      const result = await Event.findWithRelations('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('Instance Methods', () => {
    test('isActive deve verificar se evento está ativo', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      
      expect(event.isActive()).toBe(false);
      
      event.status = 'active';
      await event.save();
      
      expect(event.isActive()).toBe(true);
    });

    test('isPast deve verificar se evento já aconteceu', async () => {
      const futureEvent = await Event.createEvent(testUtils.createEventData());
      expect(futureEvent.isPast()).toBe(false);

      // Criar evento com data válida primeiro, depois alterar diretamente no banco
      const event = await Event.createEvent(testUtils.createEventData({
        name: 'Evento Passado'
      }));
      
      // Forçar data no passado após criação (bypass da validação)
      await Event.updateOne({ id: event.id }, { date: new Date('2020-01-01') });
      const updatedEvent = await Event.findByPublicId(event.id);
      
      expect(updatedEvent.isPast()).toBe(true);
    });

    test('isConfirmationExpired deve verificar prazo de confirmação', async () => {
      const futureDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // amanhã
      const pastDeadline = new Date('2020-01-01'); // passado
      
      const eventWithFutureDeadline = await Event.createEvent(testUtils.createEventData({
        confirmationDeadline: futureDeadline
      }));
      expect(eventWithFutureDeadline.isConfirmationExpired()).toBe(false);

      const eventWithoutDeadline = await Event.createEvent(testUtils.createEventData({
        confirmationDeadline: undefined
      }));
      expect(eventWithoutDeadline.isConfirmationExpired()).toBe(false);

      // Para testar prazo expirado, criar evento e depois forçar prazo no passado
      const eventWithExpiredDeadline = await Event.createEvent(testUtils.createEventData());
      await Event.updateOne({ id: eventWithExpiredDeadline.id }, { confirmationDeadline: pastDeadline });
      const updatedEvent = await Event.findByPublicId(eventWithExpiredDeadline.id);
      
      expect(updatedEvent.isConfirmationExpired()).toBe(true);
    });
  });

  describe('Hooks and Middleware', () => {
    test('deve converter status para lowercase', async () => {
      const event = await Event.createEvent(testUtils.createEventData());
      
      event.status = 'ACTIVE';
      await event.save();
      
      expect(event.status).toBe('active');
    });

    test('deve trimmar strings', async () => {
      const eventData = testUtils.createEventData({
        name: '  Churrasco com Espaços  ',
        location: '  Local com Espaços  '
      });
      
      const event = await Event.createEvent(eventData);
      
      expect(event.name).toBe('Churrasco com Espaços');
      expect(event.location).toBe('Local com Espaços');
    });
  });

  describe('Indexes and Performance', () => {
    test('deve ter índices únicos criados', async () => {
      const event1 = await Event.createEvent(testUtils.createEventData());
      
      // Tentar criar outro documento com mesmo ID público deve falhar
      const duplicateEvent = new Event({
        ...testUtils.createEventData(),
        id: event1.id
      });
      
      await expect(duplicateEvent.save()).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('deve tratar erros de validação adequadamente', async () => {
      try {
        await Event.createEvent({});
      } catch (error) {
        expect(error.message).toContain('Erro de validação');
      }
    });

    test('deve tratar erros de busca adequadamente', async () => {
      // Simular erro de conexão
      const originalFindOne = Event.findOne;
      Event.findOne = jest.fn().mockRejectedValue(new Error('Connection error'));

      try {
        await Event.findByPublicId('test-id');
      } catch (error) {
        expect(error.message).toContain('Erro ao buscar evento');
      }

      // Restaurar método original
      Event.findOne = originalFindOne;
    });
  });
});