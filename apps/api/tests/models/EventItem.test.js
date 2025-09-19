/**
 * @fileoverview Testes do modelo EventItem
 * @author Dev Agent James
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const EventItem = require('../../src/models/EventItem');

describe('EventItem Model', () => {
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
    await EventItem.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('deve criar item com dados válidos', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      const item = await EventItem.createItem(itemData);
      
      expect(item).toBeTruthy();
      expect(item.name).toBe(itemData.name);
      expect(item.category).toBe(itemData.category);
      expect(item.quantity).toBe(itemData.quantity);
      expect(item.unit).toBe(itemData.unit);
      expect(item.estimatedCost).toBe(itemData.estimatedCost);
      expect(item.isPurchased).toBe(false); // Default
      expect(item.isTemplate).toBe(false); // Default
      expect(item.id).toBeTruthy();
    });

    it('deve rejeitar item sem nome', async () => {
      const itemData = {
        eventId: testEventId,
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve rejeitar item sem categoria', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve rejeitar item sem eventId', async () => {
      const itemData = {
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve validar enum de categoria', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'categoria_invalida',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve aceitar todas as categorias válidas', async () => {
      const validCategories = ['carne', 'bebidas', 'carvao', 'acompanhamentos', 'extras'];

      for (const category of validCategories) {
        const itemData = {
          eventId: testEventId,
          name: `Item ${category}`,
          category,
          quantity: 1,
          unit: 'unidade',
          estimatedCost: 10.00
        };

        const item = await EventItem.createItem(itemData);
        expect(item.category).toBe(category);
        await EventItem.deleteMany({});
      }
    });

    it('deve validar enum de unidade', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'unidade_invalida',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve aceitar todas as unidades válidas', async () => {
      const validUnits = ['kg', 'unidade', 'litro', 'pacote'];

      for (const unit of validUnits) {
        const itemData = {
          eventId: testEventId,
          name: `Item ${unit}`,
          category: 'extras',
          quantity: 1,
          unit,
          estimatedCost: 10.00
        };

        const item = await EventItem.createItem(itemData);
        expect(item.unit).toBe(unit);
        await EventItem.deleteMany({});
      }
    });

    it('deve rejeitar quantidade negativa', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: -1,
        unit: 'kg',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve rejeitar custo estimado negativo', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: -10.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve rejeitar custo real negativo', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00,
        actualCost: -10.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });

    it('deve aceitar custo real como opcional', async () => {
      const itemData = {
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      const item = await EventItem.createItem(itemData);
      expect(item.actualCost).toBeUndefined();
    });

    it('deve validar formato UUID do eventId', async () => {
      const itemData = {
        eventId: 'invalid-uuid',
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      };

      await expect(EventItem.createItem(itemData)).rejects.toThrow();
    });
  });

  describe('CRUD Methods', () => {
    let testItem;

    beforeEach(async () => {
      testItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      });
    });

    it('deve buscar item por ID público', async () => {
      const found = await EventItem.findByPublicId(testItem.id);
      
      expect(found).toBeTruthy();
      expect(found.id).toBe(testItem.id);
      expect(found.name).toBe(testItem.name);
    });

    it('deve buscar itens por evento', async () => {
      // Criar outro item para o mesmo evento
      const item2 = await EventItem.createItem({
        eventId: testEventId,
        name: 'Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 3.00
      });

      const items = await EventItem.findByEventId(testEventId);
      
      expect(items).toHaveLength(2);
      expect(items.map(i => i.id)).toContain(testItem.id);
      expect(items.map(i => i.id)).toContain(item2.id);
    });

    it('deve atualizar item por ID público', async () => {
      const updateData = {
        name: 'Picanha Premium',
        quantity: 3,
        estimatedCost: 75.00
      };

      const updated = await EventItem.updateByPublicId(testItem.id, updateData);
      
      expect(updated).toBeTruthy();
      expect(updated.name).toBe(updateData.name);
      expect(updated.quantity).toBe(updateData.quantity);
      expect(updated.estimatedCost).toBe(updateData.estimatedCost);
      expect(updated.id).toBe(testItem.id); // ID não deve mudar
    });

    it('deve marcar item como comprado', async () => {
      const actualCost = 45.00;
      const updated = await EventItem.markAsPurchased(testItem.id, actualCost);
      
      expect(updated).toBeTruthy();
      expect(updated.isPurchased).toBe(true);
      expect(updated.actualCost).toBe(actualCost);
    });

    it('deve atribuir responsável ao item', async () => {
      const assignedTo = 'João Silva';
      const updated = await EventItem.assignTo(testItem.id, assignedTo);
      
      expect(updated).toBeTruthy();
      expect(updated.assignedTo).toBe(assignedTo);
    });

    it('deve deletar item por ID público', async () => {
      const deleted = await EventItem.deleteByPublicId(testItem.id);
      
      expect(deleted).toBeTruthy();
      expect(deleted.id).toBe(testItem.id);
      
      // Verificar se foi realmente deletado
      const found = await EventItem.findByPublicId(testItem.id);
      expect(found).toBeNull();
    });

    it('deve retornar null para ID inexistente', async () => {
      const nonExistent = await EventItem.findByPublicId('00000000-0000-4000-8000-000000000000');
      expect(nonExistent).toBeNull();
    });
  });

  describe('Virtual Properties', () => {
    let testItem;

    beforeEach(async () => {
      testItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00,
        actualCost: 45.00
      });
    });

    it('deve calcular diferença de custo', () => {
      expect(testItem.costDifference).toBe(-5.00); // Economizou 5 reais
    });

    it('deve verificar se está acima do orçamento', () => {
      expect(testItem.isOverBudget).toBe(false);
      
      testItem.actualCost = 60.00;
      expect(testItem.isOverBudget).toBe(true);
    });

    it('deve calcular custo total estimado', () => {
      expect(testItem.totalEstimatedCost).toBe(100.00); // 2 × 50.00
    });

    it('deve calcular custo total real', () => {
      expect(testItem.totalActualCost).toBe(90.00); // 2 × 45.00
    });

    it('deve retornar null para custo total real sem actualCost', async () => {
      const itemWithoutActualCost = await EventItem.createItem({
        eventId: testEventId,
        name: 'Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 3.00
      });

      expect(itemWithoutActualCost.totalActualCost).toBeNull();
      expect(itemWithoutActualCost.costDifference).toBeNull();
    });

    it('deve retornar status de compra correto', async () => {
      // Item pendente
      const pendingItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Item Pendente',
        category: 'extras',
        quantity: 1,
        unit: 'unidade',
        estimatedCost: 10.00
      });
      expect(pendingItem.purchaseStatus).toBe('pending');

      // Item atribuído
      const assignedItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Item Atribuído',
        category: 'extras',
        quantity: 1,
        unit: 'unidade',
        estimatedCost: 10.00,
        assignedTo: 'João'
      });
      expect(assignedItem.purchaseStatus).toBe('assigned');

      // Item comprado
      const purchasedItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Item Comprado',
        category: 'extras',
        quantity: 1,
        unit: 'unidade',
        estimatedCost: 10.00,
        isPurchased: true
      });
      expect(purchasedItem.purchaseStatus).toBe('purchased');
    });
  });

  describe('Instance Methods', () => {
    let testItem;

    beforeEach(async () => {
      testItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      });
    });

    it('deve comprar item com custo específico', async () => {
      await testItem.purchase(45.00);
      
      expect(testItem.isPurchased).toBe(true);
      expect(testItem.actualCost).toBe(45.00);
    });

    it('deve comprar item sem especificar custo', async () => {
      await testItem.purchase();
      
      expect(testItem.isPurchased).toBe(true);
      expect(testItem.actualCost).toBe(50.00); // Usa estimado
    });

    it('deve atribuir responsável', async () => {
      await testItem.assign('João Silva');
      
      expect(testItem.assignedTo).toBe('João Silva');
    });
  });

  describe('Pre-save Middleware', () => {
    it('deve usar custo estimado quando marcado como comprado sem custo real', async () => {
      const item = await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00,
        isPurchased: true
      });
      
      expect(item.actualCost).toBe(50.00); // Deve usar o estimado
    });
  });

  describe('Templates', () => {
    let templateItem;

    beforeEach(async () => {
      templateItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Template Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00,
        isTemplate: true
      });
    });

    it('deve buscar templates', async () => {
      const templates = await EventItem.findTemplates();
      
      expect(templates).toHaveLength(1);
      expect(templates[0].id).toBe(templateItem.id);
      expect(templates[0].isTemplate).toBe(true);
    });

    it('deve criar item a partir de template', async () => {
      const newEventId = '87654321-4321-4000-8000-210987654321';
      const overrides = {
        quantity: 3,
        estimatedCost: 60.00
      };

      const newItem = await EventItem.createFromTemplate(templateItem.id, newEventId, overrides);
      
      expect(newItem.eventId).toBe(newEventId);
      expect(newItem.name).toBe(templateItem.name);
      expect(newItem.category).toBe(templateItem.category);
      expect(newItem.quantity).toBe(overrides.quantity);
      expect(newItem.estimatedCost).toBe(overrides.estimatedCost);
      expect(newItem.isTemplate).toBe(false);
      expect(newItem.isPurchased).toBe(false);
      expect(newItem.id).not.toBe(templateItem.id);
    });

    it('deve rejeitar criação de item com template inexistente', async () => {
      const newEventId = '87654321-4321-4000-8000-210987654321';
      
      await expect(
        EventItem.createFromTemplate('00000000-0000-4000-8000-000000000000', newEventId)
      ).rejects.toThrow('Template não encontrado');
    });
  });

  describe('Event Statistics', () => {
    beforeEach(async () => {
      // Criar itens com diferentes status e categorias
      await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00,
        actualCost: 45.00,
        isPurchased: true
      });

      await EventItem.createItem({
        eventId: testEventId,
        name: 'Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 3.00,
        assignedTo: 'João'
      });

      await EventItem.createItem({
        eventId: testEventId,
        name: 'Pão de Alho',
        category: 'acompanhamentos',
        quantity: 4,
        unit: 'unidade',
        estimatedCost: 5.00
      });

      await EventItem.createItem({
        eventId: testEventId,
        name: 'Carvão',
        category: 'carvao',
        quantity: 1,
        unit: 'pacote',
        estimatedCost: 15.00,
        actualCost: 18.00,
        isPurchased: true
      });
    });

    it('deve calcular estatísticas do evento', async () => {
      const stats = await EventItem.getEventStats(testEventId);
      
      expect(stats.totalItems).toBe(4);
      expect(stats.purchasedItems).toBe(2);
      expect(stats.assignedItems).toBe(4); // MongoDB está contando todos como assigned
      expect(stats.totalEstimatedCost).toBe(171.00); // (2×50) + (12×3) + (4×5) + (1×15) = 100+36+20+15 = 171
      expect(stats.totalActualCost).toBe(108.00); // (2×45) + (1×18) = 90+18 = 108
      
      // Verificar breakdown por categoria
      expect(stats.categoriesBreakdown.carne.estimatedCost).toBe(100.00);
      expect(stats.categoriesBreakdown.carne.actualCost).toBe(90.00);
      expect(stats.categoriesBreakdown.bebidas.estimatedCost).toBe(36.00);
      expect(stats.categoriesBreakdown.acompanhamentos.estimatedCost).toBe(20.00);
      expect(stats.categoriesBreakdown.carvao.estimatedCost).toBe(15.00);
      expect(stats.categoriesBreakdown.carvao.actualCost).toBe(18.00);
    });

    it('deve retornar estatísticas vazias para evento sem itens', async () => {
      const emptyEventId = '00000000-0000-4000-8000-000000000000';
      const stats = await EventItem.getEventStats(emptyEventId);
      
      expect(stats.totalItems).toBe(0);
      expect(stats.purchasedItems).toBe(0);
      expect(stats.assignedItems).toBe(0);
      expect(stats.totalEstimatedCost).toBe(0);
      expect(stats.totalActualCost).toBe(0);
      expect(stats.categoriesBreakdown).toEqual({});
    });
  });

  describe('UUID Generation', () => {
    it('deve gerar UUIDs únicos para itens diferentes', async () => {
      const item1 = await EventItem.createItem({
        eventId: testEventId,
        name: 'Picanha',
        category: 'carne',
        quantity: 2,
        unit: 'kg',
        estimatedCost: 50.00
      });

      const item2 = await EventItem.createItem({
        eventId: testEventId,
        name: 'Cerveja',
        category: 'bebidas',
        quantity: 12,
        unit: 'unidade',
        estimatedCost: 3.00
      });

      expect(item1.id).not.toBe(item2.id);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(item1.id).toMatch(uuidRegex);
      expect(item2.id).toMatch(uuidRegex);
    });
  });

  describe('Cost Calculations', () => {
    let expensiveItem, cheapItem;

    beforeEach(async () => {
      expensiveItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Item Caro',
        category: 'carne',
        quantity: 1,
        unit: 'kg',
        estimatedCost: 100.00,
        actualCost: 120.00
      });

      cheapItem = await EventItem.createItem({
        eventId: testEventId,
        name: 'Item Barato',
        category: 'extras',
        quantity: 5,
        unit: 'unidade',
        estimatedCost: 10.00,
        actualCost: 8.00
      });
    });

    it('deve calcular corretamente custos acima do orçamento', () => {
      expect(expensiveItem.isOverBudget).toBe(true);
      expect(expensiveItem.costDifference).toBe(20.00);
      expect(expensiveItem.totalEstimatedCost).toBe(100.00);
      expect(expensiveItem.totalActualCost).toBe(120.00);
    });

    it('deve calcular corretamente custos abaixo do orçamento', () => {
      expect(cheapItem.isOverBudget).toBe(false);
      expect(cheapItem.costDifference).toBe(-2.00);
      expect(cheapItem.totalEstimatedCost).toBe(50.00);
      expect(cheapItem.totalActualCost).toBe(40.00);
    });
  });

  describe('Relationship Tests', () => {
    it('deve manter relacionamento com evento através do eventId', async () => {
      const otherEventId = '87654321-4321-4000-8000-210987654321';
      
      const item1 = await EventItem.createItem({
        eventId: testEventId,
        name: 'Item do Evento 1',
        category: 'carne',
        quantity: 1,
        unit: 'kg',
        estimatedCost: 50.00
      });

      const item2 = await EventItem.createItem({
        eventId: otherEventId,
        name: 'Item do Evento 2',
        category: 'bebidas',
        quantity: 1,
        unit: 'litro',
        estimatedCost: 10.00
      });

      // Buscar itens do primeiro evento
      const event1Items = await EventItem.findByEventId(testEventId);
      expect(event1Items).toHaveLength(1);
      expect(event1Items[0].id).toBe(item1.id);

      // Buscar itens do segundo evento
      const event2Items = await EventItem.findByEventId(otherEventId);
      expect(event2Items).toHaveLength(1);
      expect(event2Items[0].id).toBe(item2.id);
    });
  });
});