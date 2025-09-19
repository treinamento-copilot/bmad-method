/**
 * @fileoverview Testes do modelo EventItem
 * Testa validações, métodos CRUD e funcionalidades de templates
 */

const Event = require('../../src/models/Event');
const EventItem = require('../../src/models/EventItem');

describe('EventItem Model', () => {
  let testEvent;

  beforeEach(async () => {
    // Criar evento para usar nos testes
    testEvent = await Event.createEvent(testUtils.createEventData());
  });

  describe('Schema Validation', () => {
    test('deve criar um item válido com dados obrigatórios', async () => {
      const itemData = testUtils.createEventItemData(testEvent.id);
      const item = await EventItem.createItem(itemData);

      expect(item.id).toBeDefined();
      expect(item.eventId).toBe(testEvent.id);
      expect(item.name).toBe(itemData.name);
      expect(item.category).toBe(itemData.category);
      expect(item.quantity).toBe(itemData.quantity);
      expect(item.unit).toBe(itemData.unit);
      expect(item.estimatedCost).toBe(itemData.estimatedCost);
      expect(item.isPurchased).toBe(false);
      expect(item.isTemplate).toBe(false);
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
    });

    test('deve gerar ID único automaticamente', async () => {
      const itemData = testUtils.createEventItemData(testEvent.id);
      const item1 = await EventItem.createItem(itemData);
      const item2 = await EventItem.createItem({ ...itemData, name: 'Cerveja' });

      expect(item1.id).toBeDefined();
      expect(item2.id).toBeDefined();
      expect(item1.id).not.toBe(item2.id);
      
      // Verificar formato UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(item1.id)).toBe(true);
      expect(uuidRegex.test(item2.id)).toBe(true);
    });

    test('deve validar campos obrigatórios', async () => {
      // Sem eventId
      await expect(EventItem.createItem({
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 80
      })).rejects.toThrow(/validação/);

      // Sem nome
      await expect(EventItem.createItem({
        eventId: testEvent.id,
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 80
      })).rejects.toThrow(/validação/);
    });

    test('deve validar tamanho mínimo e máximo dos campos', async () => {
      // Nome muito curto
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        name: 'A'
      }))).rejects.toThrow(/pelo menos 2 caracteres/);

      // Nome muito longo
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        name: 'A'.repeat(101)
      }))).rejects.toThrow(/não pode exceder 100 caracteres/);

      // AssignedTo muito longo
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        assignedTo: 'A'.repeat(101)
      }))).rejects.toThrow(/não pode exceder 100 caracteres/);
    });

    test('deve validar enums de categoria', async () => {
      const validCategories = ['carne', 'bebidas', 'carvao', 'acompanhamentos', 'extras'];
      
      for (const category of validCategories) {
        const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
          name: `Teste ${category}`,
          category
        }));
        expect(item.category).toBe(category);
      }

      // Categoria inválida
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        category: 'invalid'
      }))).rejects.toThrow(/Categoria deve ser/);
    });

    test('deve validar enums de unidade', async () => {
      const validUnits = ['kg', 'unidade', 'litro', 'pacote'];
      
      for (const unit of validUnits) {
        const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
          name: `Teste ${unit}`,
          unit
        }));
        expect(item.unit).toBe(unit);
      }

      // Unidade inválida
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        unit: 'invalid'
      }))).rejects.toThrow(/Unidade deve ser/);
    });

    test('deve validar valores numéricos positivos', async () => {
      // Quantidade negativa
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        quantity: -1
      }))).rejects.toThrow(/não pode ser negativa/);

      // Custo estimado negativo
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        estimatedCost: -10
      }))).rejects.toThrow(/não pode ser negativo/);

      // Custo real negativo
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        actualCost: -5
      }))).rejects.toThrow(/não pode ser negativo/);
    });

    test('deve validar eventId formato UUID', async () => {
      await expect(EventItem.createItem(testUtils.createEventItemData('invalid-uuid'))).rejects.toThrow(/UUID válido/);
    });
  });

  describe('CRUD Operations', () => {
    test('findByPublicId deve encontrar item por ID público', async () => {
      const itemData = testUtils.createEventItemData(testEvent.id);
      const createdItem = await EventItem.createItem(itemData);

      const foundItem = await EventItem.findByPublicId(createdItem.id);
      
      expect(foundItem).toBeTruthy();
      expect(foundItem.id).toBe(createdItem.id);
      expect(foundItem.name).toBe(itemData.name);
    });

    test('updateByPublicId deve atualizar item', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      
      const updateData = {
        name: 'Item Atualizado',
        quantity: 5,
        actualCost: 100.00,
        isPurchased: true
      };

      const updatedItem = await EventItem.updateByPublicId(item.id, updateData);

      expect(updatedItem.name).toBe(updateData.name);
      expect(updatedItem.quantity).toBe(updateData.quantity);
      expect(updatedItem.actualCost).toBe(updateData.actualCost);
      expect(updatedItem.isPurchased).toBe(updateData.isPurchased);
    });

    test('updateByPublicId não deve permitir alterar campos protegidos', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      const originalId = item.id;
      const originalEventId = item.eventId;
      
      const updateData = {
        id: 'new-id',
        eventId: 'new-event-id',
        name: 'Nome Atualizado'
      };

      const updatedItem = await EventItem.updateByPublicId(item.id, updateData);

      expect(updatedItem.id).toBe(originalId);
      expect(updatedItem.eventId).toBe(originalEventId);
      expect(updatedItem.name).toBe(updateData.name);
    });

    test('deleteByPublicId deve remover item', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      
      const deletedItem = await EventItem.deleteByPublicId(item.id);
      expect(deletedItem.id).toBe(item.id);

      const foundItem = await EventItem.findByPublicId(item.id);
      expect(foundItem).toBeNull();
    });

    test('findByEvent deve buscar itens por evento', async () => {
      // Criar itens para o evento
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { name: 'Picanha' }));
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { name: 'Cerveja' }));
      
      // Criar outro evento e item
      const otherEvent = await Event.createEvent(testUtils.createEventData({ name: 'Outro Evento' }));
      await EventItem.createItem(testUtils.createEventItemData(otherEvent.id, { name: 'Linguiça' }));

      const items = await EventItem.findByEvent(testEvent.id);

      expect(items.length).toBe(2);
      items.forEach(item => {
        expect(item.eventId).toBe(testEvent.id);
      });
    });

    test('findByEvent deve filtrar por categoria', async () => {
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Picanha',
        category: 'carne'
      }));
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Cerveja',
        category: 'bebidas'
      }));

      const carneItems = await EventItem.findByEvent(testEvent.id, { category: 'carne' });
      const bebidasItems = await EventItem.findByEvent(testEvent.id, { category: 'bebidas' });

      expect(carneItems.length).toBe(1);
      expect(carneItems[0].name).toBe('Picanha');
      expect(bebidasItems.length).toBe(1);
      expect(bebidasItems[0].name).toBe('Cerveja');
    });

    test('findByEvent deve filtrar por status de compra', async () => {
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Picanha',
        isPurchased: true
      }));
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Cerveja',
        isPurchased: false
      }));

      const purchasedItems = await EventItem.findByEvent(testEvent.id, { isPurchased: true });
      const notPurchasedItems = await EventItem.findByEvent(testEvent.id, { isPurchased: false });

      expect(purchasedItems.length).toBe(1);
      expect(purchasedItems[0].name).toBe('Picanha');
      expect(notPurchasedItems.length).toBe(1);
      expect(notPurchasedItems[0].name).toBe('Cerveja');
    });
  });

  describe('Templates Functionality', () => {
    test('findTemplates deve buscar apenas templates', async () => {
      // Criar itens normais
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { name: 'Item Normal' }));
      
      // Criar templates
      await EventItem.createItem({
        name: 'Template Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 80,
        isTemplate: true
      });
      await EventItem.createItem({
        name: 'Template Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 60,
        isTemplate: true
      });

      const templates = await EventItem.findTemplates();

      expect(templates.length).toBe(2);
      templates.forEach(template => {
        expect(template.isTemplate).toBe(true);
        expect(template.eventId).toBeUndefined();
      });
    });

    test('findTemplates deve filtrar por categoria', async () => {
      // Criar templates de diferentes categorias
      await EventItem.createItem({
        name: 'Template Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 80,
        isTemplate: true
      });
      await EventItem.createItem({
        name: 'Template Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 60,
        isTemplate: true
      });

      const carneTemplates = await EventItem.findTemplates({ category: 'carne' });
      
      expect(carneTemplates.length).toBe(1);
      expect(carneTemplates[0].name).toBe('Template Picanha');
    });

    test('createFromTemplates deve criar itens a partir de templates', async () => {
      // Criar templates
      const template1 = await EventItem.createItem({
        name: 'Template Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 80,
        isTemplate: true
      });
      const template2 = await EventItem.createItem({
        name: 'Template Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 60,
        isTemplate: true
      });

      const newItems = await EventItem.createFromTemplates(testEvent.id, [template1.id, template2.id]);

      expect(newItems.length).toBe(2);
      newItems.forEach(item => {
        expect(item.eventId).toBe(testEvent.id);
        expect(item.isTemplate).toBe(false);
      });

      // Verificar se os dados foram copiados corretamente
      const picanhaItem = newItems.find(item => item.name === 'Template Picanha');
      expect(picanhaItem.category).toBe('carne');
      expect(picanhaItem.quantity).toBe(2);
      expect(picanhaItem.unit).toBe('kg');
      expect(picanhaItem.estimatedCost).toBe(80);
    });

    test('createFromTemplates deve falhar para templates inexistentes', async () => {
      await expect(EventItem.createFromTemplates(testEvent.id, ['non-existent-id'])).rejects.toThrow(/não foram encontrados/);
    });
  });

  describe('Statistics and Analytics', () => {
    test('calculateEventStats deve calcular estatísticas do evento', async () => {
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Picanha',
        category: 'carne',
        estimatedCost: 80,
        actualCost: 85,
        isPurchased: true
      }));
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Cerveja',
        category: 'bebidas',
        estimatedCost: 60,
        isPurchased: false
      }));
      await EventItem.createItem(testUtils.createEventItemData(testEvent.id, { 
        name: 'Carvão',
        category: 'carvao',
        estimatedCost: 20,
        actualCost: 18,
        isPurchased: true
      }));

      const stats = await EventItem.calculateEventStats(testEvent.id);

      expect(stats.totalItems).toBe(3);
      expect(stats.purchasedItems).toBe(2);
      expect(stats.pendingItems).toBe(1);
      expect(stats.totalEstimatedCost).toBe(160);
      expect(stats.totalActualCost).toBe(103); // 85 + 18
      expect(stats.categories).toHaveLength(3);
      expect(stats.byCategory).toBeDefined();
      expect(stats.byCategory.carne.count).toBe(1);
      expect(stats.byCategory.carne.purchased).toBe(1);
      expect(stats.byCategory.bebidas.count).toBe(1);
      expect(stats.byCategory.bebidas.purchased).toBe(0);
    });
  });

  describe('Instance Methods', () => {
    test('wasPurchased deve verificar se foi comprado', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      
      expect(item.wasPurchased()).toBe(false);
      
      item.isPurchased = true;
      expect(item.wasPurchased()).toBe(true);
    });

    test('isTemplateItem deve verificar se é template', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      const template = await EventItem.createItem({
        name: 'Template',
        category: 'carne',
        quantity: 1,
        unit: 'kg',
        estimatedCost: 50,
        isTemplate: true
      });
      
      expect(item.isTemplateItem()).toBe(false);
      expect(template.isTemplateItem()).toBe(true);
    });

    test('markAsPurchased deve marcar como comprado', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      
      await item.markAsPurchased(90, 'João Silva');
      
      expect(item.isPurchased).toBe(true);
      expect(item.actualCost).toBe(90);
      expect(item.assignedTo).toBe('João Silva');
    });

    test('markAsPurchased deve validar custo real', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id));
      
      await expect(item.markAsPurchased(-10)).rejects.toThrow(/não pode ser negativo/);
    });

    test('markAsNotPurchased deve desmarcar como comprado', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        isPurchased: true,
        actualCost: 90
      }));
      
      await item.markAsNotPurchased();
      
      expect(item.isPurchased).toBe(false);
      expect(item.actualCost).toBeUndefined();
    });

    test('convertToTemplate deve criar template baseado no item', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        name: 'Picanha Especial',
        actualCost: 95,
        assignedTo: 'João',
        isPurchased: true
      }));
      
      const template = await item.convertToTemplate();
      
      expect(template.isTemplate).toBe(true);
      expect(template.name).toBe('Picanha Especial');
      expect(template.category).toBe(item.category);
      expect(template.estimatedCost).toBe(item.estimatedCost);
      expect(template.eventId).toBeUndefined();
      expect(template.actualCost).toBeUndefined();
      expect(template.assignedTo).toBeUndefined();
      expect(template.isPurchased).toBe(false);
    });
  });

  describe('Hooks and Middleware', () => {
    test('deve converter categoria e unidade para lowercase', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        category: 'CARNE',
        unit: 'KG'
      }));
      
      expect(item.category).toBe('carne');
      expect(item.unit).toBe('kg');
    });

    test('deve usar custo estimado como custo real quando comprado sem custo real', async () => {
      const item = await EventItem.createItem(testUtils.createEventItemData(testEvent.id, {
        estimatedCost: 80
      }));
      
      item.isPurchased = true;
      await item.save();
      
      expect(item.actualCost).toBe(80);
    });

    test('templates não devem ter eventId', async () => {
      const template = await EventItem.createItem({
        name: 'Template',
        category: 'carne',
        quantity: 1,
        unit: 'kg',
        estimatedCost: 50,
        isTemplate: true,
        eventId: testEvent.id // Tentar definir eventId
      });
      
      expect(template.eventId).toBeUndefined();
    });

    test('deve trimmar strings', async () => {
      const itemData = testUtils.createEventItemData(testEvent.id, {
        name: '  Picanha Especial  ',
        assignedTo: '  João Silva  '
      });
      
      const item = await EventItem.createItem(itemData);
      
      expect(item.name).toBe('Picanha Especial');
      expect(item.assignedTo).toBe('João Silva');
    });

    test('deve validar existência do evento para itens não-template', async () => {
      // Usar UUID válido mas que não existe no banco
      const invalidEventId = '12345678-1234-5678-9abc-123456789012';
      
      await expect(EventItem.createItem(testUtils.createEventItemData(invalidEventId))).rejects.toThrow(/Evento não encontrado/);
    });

    test('não deve permitir adicionar item a evento cancelado', async () => {
      // Cancelar o evento
      await Event.updateByPublicId(testEvent.id, { status: 'cancelled' });
      
      await expect(EventItem.createItem(testUtils.createEventItemData(testEvent.id))).rejects.toThrow(/evento cancelado/);
    });
  });

  describe('Error Handling', () => {
    test('deve tratar erros de validação adequadamente', async () => {
      try {
        await EventItem.createItem({});
      } catch (error) {
        expect(error.message).toContain('Erro de validação');
      }
    });
  });
});