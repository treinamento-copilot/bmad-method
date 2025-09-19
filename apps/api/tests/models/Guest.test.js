/**
 * @fileoverview Testes do modelo Guest
 * Testa validações, métodos CRUD e relacionamentos
 */

const Event = require('../../src/models/Event');
const Guest = require('../../src/models/Guest');

describe('Guest Model', () => {
  let testEvent;

  beforeEach(async () => {
    // Criar evento para usar nos testes
    testEvent = await Event.createEvent(testUtils.createEventData());
  });

  describe('Schema Validation', () => {
    test('deve criar um convidado válido com dados obrigatórios', async () => {
      const guestData = testUtils.createGuestData(testEvent.id);
      const guest = await Guest.createGuest(guestData);

      expect(guest.id).toBeDefined();
      expect(guest.eventId).toBe(testEvent.id);
      expect(guest.name).toBe(guestData.name);
      expect(guest.phone).toBe(guestData.phone);
      expect(guest.rsvpStatus).toBe('pending');
      expect(guest.paymentStatus).toBe('pending');
      expect(guest.createdAt).toBeDefined();
      expect(guest.updatedAt).toBeDefined();
    });

    test('deve gerar ID único automaticamente', async () => {
      const guestData = testUtils.createGuestData(testEvent.id);
      const guest1 = await Guest.createGuest(guestData);
      const guest2 = await Guest.createGuest({ ...guestData, name: 'Maria' });

      expect(guest1.id).toBeDefined();
      expect(guest2.id).toBeDefined();
      expect(guest1.id).not.toBe(guest2.id);
      
      // Verificar formato UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(guest1.id)).toBe(true);
      expect(uuidRegex.test(guest2.id)).toBe(true);
    });

    test('deve validar campos obrigatórios', async () => {
      // Sem eventId
      await expect(Guest.createGuest({
        name: 'João Silva'
      })).rejects.toThrow(/validação/);

      // Sem name
      await expect(Guest.createGuest({
        eventId: testEvent.id
      })).rejects.toThrow(/validação/);
    });

    test('deve validar tamanho mínimo e máximo dos campos', async () => {
      // Nome muito curto
      await expect(Guest.createGuest(testUtils.createGuestData(testEvent.id, {
        name: 'A'
      }))).rejects.toThrow(/pelo menos 2 caracteres/);

      // Nome muito longo
      await expect(Guest.createGuest(testUtils.createGuestData(testEvent.id, {
        name: 'A'.repeat(101)
      }))).rejects.toThrow(/não pode exceder 100 caracteres/);

      // Telefone muito longo
      await expect(Guest.createGuest(testUtils.createGuestData(testEvent.id, {
        phone: '1'.repeat(21)
      }))).rejects.toThrow(/não pode exceder 20 caracteres/);
    });

    test('deve validar formato de telefone', async () => {
      // Telefones válidos
      const validPhones = [
        '(11) 99999-9999',
        '11 99999-9999',
        '11999999999',
        '+55 11 99999-9999',
        '(11) 9999-9999' // formato antigo
      ];

      for (const phone of validPhones) {
        const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
          name: `Teste ${phone}`,
          phone 
        }));
        expect(guest.phone).toBe(phone);
      }

      // Telefones inválidos devem falhar
      await expect(Guest.createGuest(testUtils.createGuestData(testEvent.id, {
        phone: '123' // muito curto
      }))).rejects.toThrow(/Formato de telefone inválido/);
    });

    test('deve validar eventId formato UUID', async () => {
      await expect(Guest.createGuest(testUtils.createGuestData('invalid-uuid', {
        name: 'João Silva'
      }))).rejects.toThrow(/UUID válido/);
    });

    test('deve validar enums', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      // RSVP Status válido
      guest.rsvpStatus = 'yes';
      await expect(guest.save()).resolves.toBeTruthy();

      // RSVP Status inválido
      guest.rsvpStatus = 'invalid';
      await expect(guest.save()).rejects.toThrow(/Status RSVP deve ser/);

      // Reset para testar payment status
      guest.rsvpStatus = 'yes';
      
      // Payment Status válido com method
      guest.paymentStatus = 'paid';
      guest.paymentMethod = 'pix';
      await expect(guest.save()).resolves.toBeTruthy();

      // Payment Status inválido
      guest.paymentStatus = 'invalid';
      await expect(guest.save()).rejects.toThrow(/Status de pagamento deve ser/);

      // Reset para testar payment method
      guest.paymentStatus = 'paid';
      
      // Payment Method válido
      guest.paymentMethod = 'pix';
      await expect(guest.save()).resolves.toBeTruthy();

      // Payment Method inválido
      guest.paymentMethod = 'invalid';
      await expect(guest.save()).rejects.toThrow(/Método de pagamento deve ser/);
    });

    test('deve exigir método de pagamento quando status é paid', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      guest.paymentStatus = 'paid';
      // Sem definir paymentMethod
      
      await expect(guest.save()).rejects.toThrow(/Método de pagamento é obrigatório/);
    });

    test('deve validar data de confirmação não no futuro', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      await expect(Guest.createGuest(testUtils.createGuestData(testEvent.id, {
        confirmedAt: futureDate
      }))).rejects.toThrow(/não pode ser no futuro/);
    });
  });

  describe('CRUD Operations', () => {
    test('findByPublicId deve encontrar convidado por ID público', async () => {
      const guestData = testUtils.createGuestData(testEvent.id);
      const createdGuest = await Guest.createGuest(guestData);

      const foundGuest = await Guest.findByPublicId(createdGuest.id);
      
      expect(foundGuest).toBeTruthy();
      expect(foundGuest.id).toBe(createdGuest.id);
      expect(foundGuest.name).toBe(guestData.name);
    });

    test('updateByPublicId deve atualizar convidado', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      const updateData = {
        name: 'Nome Atualizado',
        rsvpStatus: 'yes',
        phone: '(11) 88888-8888'
      };

      const updatedGuest = await Guest.updateByPublicId(guest.id, updateData);

      expect(updatedGuest.name).toBe(updateData.name);
      expect(updatedGuest.rsvpStatus).toBe(updateData.rsvpStatus);
      expect(updatedGuest.phone).toBe(updateData.phone);
      expect(updatedGuest.confirmedAt).toBeDefined(); // Deve ser preenchido automaticamente
    });

    test('updateByPublicId não deve permitir alterar campos protegidos', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      const originalId = guest.id;
      const originalEventId = guest.eventId;
      
      const updateData = {
        id: 'new-id',
        eventId: 'new-event-id',
        name: 'Nome Atualizado'
      };

      const updatedGuest = await Guest.updateByPublicId(guest.id, updateData);

      expect(updatedGuest.id).toBe(originalId);
      expect(updatedGuest.eventId).toBe(originalEventId);
      expect(updatedGuest.name).toBe(updateData.name);
    });

    test('deleteByPublicId deve remover convidado', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      const deletedGuest = await Guest.deleteByPublicId(guest.id);
      expect(deletedGuest.id).toBe(guest.id);

      const foundGuest = await Guest.findByPublicId(guest.id);
      expect(foundGuest).toBeNull();
    });

    test('findByEvent deve buscar convidados por evento', async () => {
      // Criar convidados para o evento
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { name: 'João' }));
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { name: 'Maria' }));
      
      // Criar outro evento e convidado
      const otherEvent = await Event.createEvent(testUtils.createEventData({ name: 'Outro Evento' }));
      await Guest.createGuest(testUtils.createGuestData(otherEvent.id, { name: 'Pedro' }));

      const guests = await Guest.findByEvent(testEvent.id);

      expect(guests.length).toBe(2);
      guests.forEach(guest => {
        expect(guest.eventId).toBe(testEvent.id);
      });
    });

    test('findByEvent deve filtrar por status', async () => {
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
        name: 'João',
        rsvpStatus: 'yes'
      }));
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
        name: 'Maria',
        rsvpStatus: 'pending'
      }));
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
        name: 'Pedro',
        rsvpStatus: 'no'
      }));

      const confirmedGuests = await Guest.findByEvent(testEvent.id, { rsvpStatus: 'yes' });
      const pendingGuests = await Guest.findByEvent(testEvent.id, { rsvpStatus: 'pending' });

      expect(confirmedGuests.length).toBe(1);
      expect(confirmedGuests[0].name).toBe('João');
      expect(pendingGuests.length).toBe(1);
      expect(pendingGuests[0].name).toBe('Maria');
    });

    test('countByStatus deve contar convidados por status', async () => {
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
        name: 'João',
        rsvpStatus: 'yes',
        paymentStatus: 'paid',
        paymentMethod: 'pix'
      }));
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
        name: 'Maria',
        rsvpStatus: 'pending',
        paymentStatus: 'pending'
      }));
      await Guest.createGuest(testUtils.createGuestData(testEvent.id, { 
        name: 'Pedro',
        rsvpStatus: 'no',
        paymentStatus: 'pending'
      }));

      const stats = await Guest.countByStatus(testEvent.id);

      expect(stats.total).toBe(3);
      expect(stats.confirmed).toBe(1);
      expect(stats.declined).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.paid).toBe(1);
      expect(stats.unpaid).toBe(2);
    });
  });

  describe('Instance Methods', () => {
    test('hasConfirmed deve verificar confirmação', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      expect(guest.hasConfirmed()).toBe(false);
      
      guest.rsvpStatus = 'yes';
      expect(guest.hasConfirmed()).toBe(true);
    });

    test('hasDeclined deve verificar recusa', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      expect(guest.hasDeclined()).toBe(false);
      
      guest.rsvpStatus = 'no';
      expect(guest.hasDeclined()).toBe(true);
    });

    test('hasPaid deve verificar pagamento', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      expect(guest.hasPaid()).toBe(false);
      
      guest.paymentStatus = 'paid';
      expect(guest.hasPaid()).toBe(true);
    });

    test('confirmAttendance deve confirmar presença', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      await guest.confirmAttendance();
      
      expect(guest.rsvpStatus).toBe('yes');
      expect(guest.confirmedAt).toBeDefined();
    });

    test('markAsPaid deve marcar como pago', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      await guest.markAsPaid('pix');
      
      expect(guest.paymentStatus).toBe('paid');
      expect(guest.paymentMethod).toBe('pix');
    });

    test('markAsPaid deve validar método de pagamento', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      await expect(guest.markAsPaid('invalid')).rejects.toThrow(/Método de pagamento inválido/);
    });
  });

  describe('Hooks and Middleware', () => {
    test('deve converter status para lowercase', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      guest.rsvpStatus = 'YES';
      guest.paymentStatus = 'PAID';
      guest.paymentMethod = 'PIX';
      await guest.save();
      
      expect(guest.rsvpStatus).toBe('yes');
      expect(guest.paymentStatus).toBe('paid');
      expect(guest.paymentMethod).toBe('pix');
    });

    test('deve definir confirmedAt automaticamente ao confirmar', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id));
      
      expect(guest.confirmedAt).toBeUndefined();
      
      guest.rsvpStatus = 'yes';
      await guest.save();
      
      expect(guest.confirmedAt).toBeDefined();
    });

    test('deve limpar confirmedAt ao não confirmar', async () => {
      const guest = await Guest.createGuest(testUtils.createGuestData(testEvent.id, {
        rsvpStatus: 'yes'
      }));
      
      expect(guest.confirmedAt).toBeDefined();
      
      guest.rsvpStatus = 'no';
      await guest.save();
      
      expect(guest.confirmedAt).toBeUndefined();
    });

    test('deve trimmar strings', async () => {
      const guestData = testUtils.createGuestData(testEvent.id, {
        name: '  João Silva  ',
        phone: '  (11) 99999-9999  '
      });
      
      const guest = await Guest.createGuest(guestData);
      
      expect(guest.name).toBe('João Silva');
      expect(guest.phone).toBe('(11) 99999-9999');
    });

    test('deve validar existência do evento', async () => {
      // Usar UUID válido mas que não existe no banco
      const invalidEventId = '12345678-1234-5678-9abc-123456789012';
      
      await expect(Guest.createGuest(testUtils.createGuestData(invalidEventId))).rejects.toThrow(/Evento não encontrado/);
    });

    test('não deve permitir adicionar convidado a evento cancelado', async () => {
      // Cancelar o evento
      await Event.updateByPublicId(testEvent.id, { status: 'cancelled' });
      
      await expect(Guest.createGuest(testUtils.createGuestData(testEvent.id))).rejects.toThrow(/evento cancelado/);
    });
  });

  describe('Error Handling', () => {
    test('deve tratar erros de validação adequadamente', async () => {
      try {
        await Guest.createGuest({});
      } catch (error) {
        expect(error.message).toContain('Erro de validação');
      }
    });
  });
});