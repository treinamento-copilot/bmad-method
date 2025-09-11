# Epic 3: Cálculo de Custos e Transparência Financeira

**Goal:** Criar o coração do aplicativo - sistema completo de cálculos automáticos de custos e divisão transparente entre participantes, resolvendo o principal pain point identificado no brief e entregando o maior valor diferenciado do produto.

## **DEPENDÊNCIAS CRÍTICAS DO EPIC 2:**
Este epic possui dependências diretas do Epic 2 que devem ser completamente funcionais antes do início:

1. **Guest Model e RSVP System (Epic 2)** → **Cost Calculator (Epic 3)**
   - Sistema de confirmação de presença deve estar funcionando
   - Lista de convidados confirmados deve ser acessível via API
   - Status RSVP ('yes', 'no', 'maybe') deve estar persistido no banco

2. **Guest Count Updates (Epic 2)** → **Real-time Cost Recalculation (Epic 3)**
   - Mudanças no número de participantes devem triggerar recálculo automático
   - API endpoint para contar participantes confirmados deve existir

3. **Event Data Structure (Epic 1)** → **Cost Per Item Calculation (Epic 3)**
   - EventItem model deve estar completamente implementado
   - Template de itens básicos (carne, bebidas, carvão) deve estar funcional

## **APIs NECESSÁRIAS ANTES DO EPIC 3:**
- `GET /api/events/:id/guests` - Listar convidados por evento
- `GET /api/events/:id/confirmed-count` - Contar participantes confirmados
- `GET /api/events/:id/items` - Listar itens do evento
- `PUT /api/guests/:id/rsvp` - Atualizar confirmação de presença

**⚠️ BLOCKER:** Epic 3 não pode começar até que todas as APIs acima estejam implementadas e testadas.

## Story 3.1: Calculadora Básica de Custos
Como um organizador,
Eu quero calcular custos automaticamente,
Para que eu saiba quanto cada pessoa deve pagar.

### Critérios de Aceitação
1. Campos de entrada de custo para cada item do template
2. Cálculo automático por pessoa baseado nos convidados confirmados
3. Exibição clara do custo total e custo por pessoa
4. Atualizações em tempo real quando custos ou número de convidados muda
5. Formatação de moeda brasileira (R$)

## Story 3.2: Detalhamento de Custos por Item
Como um participante,
Eu quero ver exatamente pelo que estou pagando,
Para que eu entenda a distribuição dos custos.

### Critérios de Aceitação
1. Detalhamento mostrando cada item e seu custo
2. Cálculo da parte individual para cada item
3. Distinção clara entre custos confirmados e estimados
4. Quebra percentual dos custos totais por categoria
5. Funcionalidade de exportar/compartilhar detalhamento de custos

## Story 3.3: Gestão de Itens Adicionais
Como um organizador,
Eu quero adicionar itens extras que não estão no template,
Para que eu possa contabilizar todos os custos do evento.

### Critérios de Aceitação
1. Botão "Adicionar Item" para incluir itens personalizados
2. Campos de nome do item, quantidade e custo unitário
3. Atribuição de categoria (carne, bebidas, extras, etc.)
4. Funcionalidade de editar/excluir itens adicionados
5. Itens do template permanecem editáveis

## Story 3.4: Rastreamento de Status de Pagamento
Como um organizador,
Eu quero rastrear quem pagou,
Para que eu saiba os saldos pendentes.

### Critérios de Aceitação
1. Checkbox de status de pagamento para cada participante
2. Indicadores visuais para status pago/não pago
3. Cálculo e exibição de saldo pendente
4. Notas sobre método de pagamento (PIX, dinheiro, transferência)
5. Timestamp de confirmação do pagamento
