/**
 * @fileoverview Testes do modelo Guest
 * @author Dev Agent James
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Guest = require('../../src/models/Guest');

describe('Guest Model', () => {
  let mongoServer;
  const testEventId = '12345678-1234-4000-8000-123456789012';

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
    await Guest.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('deve criar convidado com dados válidos', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva',
        phone: '(11) 99999-9999'
      };

      const guest = await Guest.createGuest(guestData);
      
      expect(guest).toBeTruthy();
      expect(guest.name).toBe(guestData.name);
      expect(guest.eventId).toBe(guestData.eventId);
      expect(guest.rsvpStatus).toBe('pending'); // Default
      expect(guest.paymentStatus).toBe('pending'); // Default
      expect(guest.id).toBeTruthy();
    });

    it('deve rejeitar convidado sem nome', async () => {
      const guestData = {
        eventId: testEventId,
        phone: '(11) 99999-9999'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });

    it('deve rejeitar convidado sem eventId', async () => {
      const guestData = {
        name: 'João Silva',
        phone: '(11) 99999-9999'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });

    it('deve validar enum de rsvpStatus', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva',
        rsvpStatus: 'invalid_status'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });

    it('deve validar enum de paymentStatus', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva',
        paymentStatus: 'invalid_status'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });

    it('deve validar enum de paymentMethod', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva',
        paymentMethod: 'invalid_method'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });

    it('deve validar formato de telefone brasileiro', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva',
        phone: '123abc'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });

    it('deve aceitar telefone em formato válido', async () => {
      const validPhones = [
        '(11) 99999-9999',
        '11999999999',
        '+55 11 99999-9999',
        '(11) 9999-9999'
      ];

      for (const phone of validPhones) {
        const guestData = {
          eventId: testEventId,
          name: 'João Silva',
          phone
        };

        const guest = await Guest.createGuest(guestData);
        expect(guest.phone).toBe(phone);
        await Guest.deleteMany({});
      }
    });

    it('deve aceitar telefone vazio (campo opcional)', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva'
      };

      const guest = await Guest.createGuest(guestData);
      expect(guest.phone).toBeUndefined();
    });

    it('deve rejeitar confirmedAt no futuro', async () => {
      const guestData = {
        eventId: testEventId,
        name: 'João Silva',
        confirmedAt: new Date(Date.now() + 86400000) // Tomorrow
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });
  });

  describe('CRUD Methods', () => {
    let testGuest;

    beforeEach(async () => {
      testGuest = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Silva',
        phone: '(11) 99999-9999'
      });
    });

    it('deve buscar convidado por ID público', async () => {
      const found = await Guest.findByPublicId(testGuest.id);
      
      expect(found).toBeTruthy();
      expect(found.id).toBe(testGuest.id);
      expect(found.name).toBe(testGuest.name);
    });

    it('deve buscar convidados por evento', async () => {
      // Criar outro convidado para o mesmo evento
      const guest2 = await Guest.createGuest({
        eventId: testEventId,
        name: 'Maria Silva'
      });

      const guests = await Guest.findByEventId(testEventId);
      
      expect(guests).toHaveLength(2);
      expect(guests.map(g => g.id)).toContain(testGuest.id);
      expect(guests.map(g => g.id)).toContain(guest2.id);
    });

    it('deve atualizar convidado por ID público', async () => {
      const updateData = {
        name: 'João Santos',
        phone: '(11) 88888-8888'
      };

      const updated = await Guest.updateByPublicId(testGuest.id, updateData);
      
      expect(updated).toBeTruthy();
      expect(updated.name).toBe(updateData.name);
      expect(updated.phone).toBe(updateData.phone);
      expect(updated.id).toBe(testGuest.id); // ID não deve mudar
    });

    it('deve atualizar RSVP com confirmação', async () => {
      const updated = await Guest.updateRSVP(testGuest.id, 'yes');
      
      expect(updated).toBeTruthy();
      expect(updated.rsvpStatus).toBe('yes');
      expect(updated.confirmedAt).toBeTruthy();
      expect(updated.isConfirmed).toBe(true);
    });

    it('deve deletar convidado por ID público', async () => {
      const deleted = await Guest.deleteByPublicId(testGuest.id);
      
      expect(deleted).toBeTruthy();
      expect(deleted.id).toBe(testGuest.id);
      
      // Verificar se foi realmente deletado
      const found = await Guest.findByPublicId(testGuest.id);
      expect(found).toBeNull();
    });

    it('deve retornar null para ID inexistente', async () => {
      const nonExistent = await Guest.findByPublicId('00000000-0000-4000-8000-000000000000');
      expect(nonExistent).toBeNull();
    });
  });

  describe('Event Statistics', () => {
    beforeEach(async () => {
      // Criar convidados com diferentes status
      await Guest.createGuest({
        eventId: testEventId,
        name: 'João (Confirmado)',
        rsvpStatus: 'yes',
        paymentStatus: 'paid'
      });

      await Guest.createGuest({
        eventId: testEventId,
        name: 'Maria (Negou)',
        rsvpStatus: 'no'
      });

      await Guest.createGuest({
        eventId: testEventId,
        name: 'Pedro (Pendente)'
      });

      await Guest.createGuest({
        eventId: testEventId,
        name: 'Ana (Talvez)',
        rsvpStatus: 'maybe'
      });
    });

    it('deve calcular estatísticas do evento', async () => {
      const stats = await Guest.getEventStats(testEventId);
      
      expect(stats.total).toBe(4);
      expect(stats.confirmed).toBe(1);
      expect(stats.declined).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.maybe).toBe(1);
      expect(stats.paid).toBe(1);
    });

    it('deve retornar estatísticas vazias para evento sem convidados', async () => {
      const emptyEventId = '00000000-0000-4000-8000-000000000000';
      const stats = await Guest.getEventStats(emptyEventId);
      
      expect(stats.total).toBe(0);
      expect(stats.confirmed).toBe(0);
      expect(stats.declined).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.maybe).toBe(0);
      expect(stats.paid).toBe(0);
    });
  });

  describe('Virtual Properties', () => {
    let confirmedGuest, pendingGuest;

    beforeEach(async () => {
      confirmedGuest = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Confirmado',
        rsvpStatus: 'yes',
        paymentStatus: 'paid',
        confirmedAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
      });

      pendingGuest = await Guest.createGuest({
        eventId: testEventId,
        name: 'Maria Pendente'
      });
    });

    it('deve verificar se está confirmado', () => {
      expect(confirmedGuest.isConfirmed).toBe(true);
      expect(pendingGuest.isConfirmed).toBe(false);
    });

    it('deve verificar se pagou', () => {
      expect(confirmedGuest.hasPaid).toBe(true);
      expect(pendingGuest.hasPaid).toBe(false);
    });

    it('deve calcular dias desde confirmação', () => {
      expect(confirmedGuest.daysSinceConfirmation).toBe(3);
      expect(pendingGuest.daysSinceConfirmation).toBeNull();
    });
  });

  describe('Instance Methods', () => {
    let testGuest;

    beforeEach(async () => {
      testGuest = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Silva'
      });
    });

    it('deve confirmar participação', async () => {
      await testGuest.confirmAttendance();
      
      expect(testGuest.rsvpStatus).toBe('yes');
      expect(testGuest.confirmedAt).toBeTruthy();
      expect(testGuest.isConfirmed).toBe(true);
    });

    it('deve marcar como pago', async () => {
      await testGuest.markAsPaid('pix');
      
      expect(testGuest.paymentStatus).toBe('paid');
      expect(testGuest.paymentMethod).toBe('pix');
      expect(testGuest.hasPaid).toBe(true);
    });

    it('deve marcar como pago sem método', async () => {
      await testGuest.markAsPaid();
      
      expect(testGuest.paymentStatus).toBe('paid');
      expect(testGuest.paymentMethod).toBeUndefined();
    });
  });

  describe('Pre-save Middleware', () => {
    it('deve adicionar confirmedAt automaticamente ao confirmar', async () => {
      const guest = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Silva',
        rsvpStatus: 'yes'
      });
      
      expect(guest.confirmedAt).toBeTruthy();
    });

    it('deve limpar confirmedAt ao mudar status', async () => {
      const guest = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Silva',
        rsvpStatus: 'yes'
      });
      
      expect(guest.confirmedAt).toBeTruthy();
      
      guest.rsvpStatus = 'no';
      await guest.save();
      
      expect(guest.confirmedAt).toBeUndefined();
    });
  });

  describe('UUID Generation', () => {
    it('deve gerar UUIDs únicos para convidados diferentes', async () => {
      const guest1 = await Guest.createGuest({
        eventId: testEventId,
        name: 'João Silva'
      });

      const guest2 = await Guest.createGuest({
        eventId: testEventId,
        name: 'Maria Silva'
      });

      expect(guest1.id).not.toBe(guest2.id);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(guest1.id).toMatch(uuidRegex);
      expect(guest2.id).toMatch(uuidRegex);
    });
  });

  describe('Relationship Tests', () => {
    it('deve manter relacionamento com evento através do eventId', async () => {
      const otherEventId = '87654321-4321-4000-8000-210987654321';
      
      const guest1 = await Guest.createGuest({
        eventId: testEventId,
        name: 'João do Evento 1'
      });

      const guest2 = await Guest.createGuest({
        eventId: otherEventId,
        name: 'Maria do Evento 2'
      });

      // Buscar convidados do primeiro evento
      const event1Guests = await Guest.findByEventId(testEventId);
      expect(event1Guests).toHaveLength(1);
      expect(event1Guests[0].id).toBe(guest1.id);

      // Buscar convidados do segundo evento
      const event2Guests = await Guest.findByEventId(otherEventId);
      expect(event2Guests).toHaveLength(1);
      expect(event2Guests[0].id).toBe(guest2.id);
    });

    it('deve validar formato UUID do eventId', async () => {
      const guestData = {
        eventId: 'invalid-uuid',
        name: 'João Silva'
      };

      await expect(Guest.createGuest(guestData)).rejects.toThrow();
    });
  });
});