/**
 * @fileoverview Testes unitários do eventService
 * @author Dev Agent James
 */

import eventService from '../../src/services/eventService';
import api, { ApiError } from '../../src/services/api';
import { calculateTemplateItems } from '../../src/utils/constants';

// Mock dos módulos
jest.mock('../../src/services/api');
jest.mock('../../src/utils/constants');

describe('eventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Testes do método createEvent
   */
  describe('createEvent', () => {
    const validEventData = {
      name: 'Churrasco da Empresa',
      date: '2025-12-25',
      location: 'Chácara do João',
      estimatedParticipants: 10
    };

    const mockTemplateItems = [
      {
        name: 'Picanha',
        category: 'carne',
        quantity: 4,
        unit: 'kg',
        estimatedCost: 32000,
        isTemplate: true
      }
    ];

    const mockApiResponse = {
      data: {
        id: 'test-event-id',
        ...validEventData,
        organizerId: 'test-organizer-id',
        status: 'draft',
        createdAt: '2025-09-26T18:00:00Z',
        items: mockTemplateItems
      }
    };

    beforeEach(() => {
      calculateTemplateItems.mockReturnValue(mockTemplateItems);
      api.post.mockResolvedValue(mockApiResponse);
    });

    test('cria evento com dados válidos', async () => {
      const result = await eventService.createEvent(validEventData);

      expect(calculateTemplateItems).toHaveBeenCalledWith(10);
      expect(api.post).toHaveBeenCalledWith('events', {
        name: 'Churrasco da Empresa',
        date: new Date('2025-12-25').toISOString(),
        location: 'Chácara do João',
        estimatedParticipants: 10,
        items: mockTemplateItems
      });
      expect(result).toEqual(mockApiResponse.data);
    });

    test('retorna resposta direta se não houver propriedade data', async () => {
      const directResponse = { id: 'test-id', name: 'Test Event' };
      api.post.mockResolvedValue(directResponse);

      const result = await eventService.createEvent(validEventData);

      expect(result).toEqual(directResponse);
    });

    test('faz trim nos campos de texto', async () => {
      const dataWithSpaces = {
        ...validEventData,
        name: '  Churrasco da Empresa  ',
        location: '  Chácara do João  '
      };

      await eventService.createEvent(dataWithSpaces);

      expect(api.post).toHaveBeenCalledWith('events', expect.objectContaining({
        name: 'Churrasco da Empresa',
        location: 'Chácara do João'
      }));
    });

    test('converte estimatedParticipants para integer', async () => {
      const dataWithStringParticipants = {
        ...validEventData,
        estimatedParticipants: '15'
      };

      await eventService.createEvent(dataWithStringParticipants);

      expect(api.post).toHaveBeenCalledWith('events', expect.objectContaining({
        estimatedParticipants: 15
      }));
    });

    test('converte data para ISO string', async () => {
      await eventService.createEvent(validEventData);

      expect(api.post).toHaveBeenCalledWith('events', expect.objectContaining({
        date: new Date('2025-12-25').toISOString()
      }));
    });

    test('lança erro quando nome está vazio', async () => {
      const invalidData = { ...validEventData, name: '' };

      await expect(eventService.createEvent(invalidData)).rejects.toThrow('Nome do evento é obrigatório');
      expect(api.post).not.toHaveBeenCalled();
    });

    test('lança erro quando nome é só espaços', async () => {
      const invalidData = { ...validEventData, name: '   ' };

      await expect(eventService.createEvent(invalidData)).rejects.toThrow('Nome do evento é obrigatório');
      expect(api.post).not.toHaveBeenCalled();
    });

    test('lança erro quando data está vazia', async () => {
      const invalidData = { ...validEventData, date: null };

      await expect(eventService.createEvent(invalidData)).rejects.toThrow('Data do evento é obrigatória');
      expect(api.post).not.toHaveBeenCalled();
    });

    test('lança erro quando local está vazio', async () => {
      const invalidData = { ...validEventData, location: '' };

      await expect(eventService.createEvent(invalidData)).rejects.toThrow('Local do evento é obrigatório');
      expect(api.post).not.toHaveBeenCalled();
    });

    test('lança erro quando número de participantes é menor que 1', async () => {
      const invalidData = { ...validEventData, estimatedParticipants: 0 };

      await expect(eventService.createEvent(invalidData)).rejects.toThrow('Número de participantes deve ser pelo menos 1');
      expect(api.post).not.toHaveBeenCalled();
    });

    test('re-throw ApiError mantendo contexto', async () => {
      const apiError = new ApiError('Dados inválidos', 400);
      api.post.mockRejectedValue(apiError);

      await expect(eventService.createEvent(validEventData)).rejects.toThrow(apiError);
    });

    test('wrap outros erros com contexto', async () => {
      const genericError = new Error('Network error');
      api.post.mockRejectedValue(genericError);

      await expect(eventService.createEvent(validEventData)).rejects.toThrow('Erro ao criar evento: Network error');
    });
  });

  /**
   * Testes do método getEvent
   */
  describe('getEvent', () => {
    const mockEventResponse = {
      data: {
        id: 'test-event-id',
        name: 'Test Event',
        date: '2025-12-25',
        location: 'Test Location',
        estimatedParticipants: 10
      }
    };

    test('busca evento por ID com sucesso', async () => {
      api.get.mockResolvedValue(mockEventResponse);

      const result = await eventService.getEvent('test-event-id');

      expect(api.get).toHaveBeenCalledWith('events/test-event-id');
      expect(result).toEqual(mockEventResponse.data);
    });

    test('retorna resposta direta se não houver propriedade data', async () => {
      const directResponse = { id: 'test-id', name: 'Test Event' };
      api.get.mockResolvedValue(directResponse);

      const result = await eventService.getEvent('test-event-id');

      expect(result).toEqual(directResponse);
    });

    test('lança erro quando ID está vazio', async () => {
      await expect(eventService.getEvent('')).rejects.toThrow('ID do evento é obrigatório');
      expect(api.get).not.toHaveBeenCalled();
    });

    test('lança erro quando ID é null', async () => {
      await expect(eventService.getEvent(null)).rejects.toThrow('ID do evento é obrigatório');
      expect(api.get).not.toHaveBeenCalled();
    });

    test('re-throw ApiError mantendo contexto', async () => {
      const apiError = new ApiError('Evento não encontrado', 404);
      api.get.mockRejectedValue(apiError);

      await expect(eventService.getEvent('invalid-id')).rejects.toThrow(apiError);
    });

    test('wrap outros erros com contexto', async () => {
      const genericError = new Error('Network error');
      api.get.mockRejectedValue(genericError);

      await expect(eventService.getEvent('test-id')).rejects.toThrow('Erro ao buscar evento: Network error');
    });
  });

  /**
   * Testes do método updateEvent
   */
  describe('updateEvent', () => {
    const updateData = { name: 'Novo Nome' };
    const mockUpdateResponse = {
      data: {
        id: 'test-event-id',
        name: 'Novo Nome',
        updatedAt: '2025-09-26T18:00:00Z'
      }
    };

    test('atualiza evento com sucesso', async () => {
      api.put.mockResolvedValue(mockUpdateResponse);

      const result = await eventService.updateEvent('test-event-id', updateData);

      expect(api.put).toHaveBeenCalledWith('events/test-event-id', updateData);
      expect(result).toEqual(mockUpdateResponse.data);
    });

    test('lança erro quando ID está vazio', async () => {
      await expect(eventService.updateEvent('', updateData)).rejects.toThrow('ID do evento é obrigatório');
      expect(api.put).not.toHaveBeenCalled();
    });
  });

  /**
   * Testes do método listEvents
   */
  describe('listEvents', () => {
    const mockEventsResponse = {
      data: [
        { id: 'event-1', name: 'Event 1' },
        { id: 'event-2', name: 'Event 2' }
      ]
    };

    test('lista eventos sem filtros', async () => {
      api.get.mockResolvedValue(mockEventsResponse);

      const result = await eventService.listEvents();

      expect(api.get).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockEventsResponse.data);
    });

    test('lista eventos com filtros', async () => {
      api.get.mockResolvedValue(mockEventsResponse);

      const filters = { status: 'active', limit: 5 };
      const result = await eventService.listEvents(filters);

      expect(api.get).toHaveBeenCalledWith('events?status=active&limit=5');
      expect(result).toEqual(mockEventsResponse.data);
    });
  });

  /**
   * Testes do método deleteEvent
   */
  describe('deleteEvent', () => {
    test('deleta evento com sucesso', async () => {
      api.delete.mockResolvedValue({});

      await eventService.deleteEvent('test-event-id');

      expect(api.delete).toHaveBeenCalledWith('events/test-event-id');
    });

    test('lança erro quando ID está vazio', async () => {
      await expect(eventService.deleteEvent('')).rejects.toThrow('ID do evento é obrigatório');
      expect(api.delete).not.toHaveBeenCalled();
    });
  });
});

/**
 * Testes das funções de template/constants
 */
describe('Template Integration Tests', () => {
  // Remove mock para testar integração real com constants
  beforeEach(() => {
    jest.unmock('../../src/utils/constants');
  });

  afterEach(() => {
    jest.mock('../../src/utils/constants');
  });

  test('calculateTemplateItems é chamado corretamente durante createEvent', async () => {
    // Este teste verifica a integração real entre eventService e constants
    const { calculateTemplateItems: realCalculateTemplateItems } = jest.requireActual('../../src/utils/constants');
    
    const mockApiResponse = {
      data: { id: 'test-id', name: 'Test Event' }
    };
    
    api.post.mockResolvedValue(mockApiResponse);
    
    const eventData = {
      name: 'Test Event',
      date: '2025-12-25',
      location: 'Test Location',
      estimatedParticipants: 10
    };

    await eventService.createEvent(eventData);

    // Verifica se o template foi calculado e incluído no payload
    const expectedItems = realCalculateTemplateItems(10);
    
    expect(api.post).toHaveBeenCalledWith('events', expect.objectContaining({
      items: expectedItems
    }));
  });
});