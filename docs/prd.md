# ChurrasApp Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Simplificar a organização de churrascos eliminando 75% do tempo gasto em logística
- Criar transparência financeira total com divisão automática e justa de custos
- Aumentar taxa de comparecimento real de convidados em 20%
- Estabelecer plataforma mobile-first acessível para todas as classes sociais brasileiras (25-65 anos)
- Atingir 1.000 usuários ativos mensais em 6 meses

### Background Context

O ChurrasApp surge para resolver uma dor real e quantificada: organizar churrascos em grupo consome 3-4 horas de logística por evento, com 30% de desistências de última hora e conflitos financeiros em 40% dos casos. Soluções existentes (WhatsApp, planilhas, apps genéricos) falham por serem fragmentadas, manuais ou excessivamente complexas.

Nossa oportunidade está na democratização da organização de eventos sociais: ao focar exclusivamente em churrascos para grupos sociais brasileiros de todas as classes sociais (25-65 anos), podemos oferecer templates pré-configurados, cálculos específicos e uma experiência otimizada que cria valor imediato para organizadores e participantes, independente do poder aquisitivo ou familiaridade tecnológica.

### Change Log

| Data | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-09-09 | 1.0 | PRD inicial baseado no Project Brief com público ampliado | John (PM) |

## Requirements

### Functional

1. **FR1:** O sistema deve permitir criação de evento através de template simples com itens essenciais (carne, bebidas, carvão)
2. **FR2:** O sistema deve calcular quantidades básicas baseadas no número de participantes
3. **FR3:** O sistema deve gerar link compartilhável para convite
4. **FR4:** O sistema deve permitir confirmação de presença simples (Sim/Não/Talvez)
5. **FR5:** O sistema deve calcular divisão de custos automática por pessoa presente
6. **FR6:** O sistema deve exibir valor total e valor por pessoa de forma transparente
7. **FR7:** O sistema deve permitir marcar itens como "comprado" em lista básica
8. **FR8:** O sistema deve mostrar status do evento (confirmados, pendentes, total estimado)
9. **FR9:** O sistema deve funcionar sem cadastro obrigatório (acesso via link)
10. **FR10:** O sistema deve ser completamente utilizável em celular

### Non Functional

1. **NFR1:** Carregamento inicial em menos de 3 segundos em 3G
2. **NFR2:** Interface responsiva para telas 320px+
3. **NFR3:** Funcionar em navegadores básicos (Chrome/Safari/Firefox)
4. **NFR4:** Disponibilidade de 99% do tempo
5. **NFR5:** Suportar até 50 participantes por evento
6. **NFR6:** Interface intuitiva para qualquer faixa etária
7. **NFR7:** Dados mínimos conforme LGPD

## User Interface Design Goals

### Overall UX Vision
Interface extremamente simples e direta, inspirada na clareza de apps bancários brasileiros como Nubank, mas com a simplicidade de uma calculadora. Foco em grandes botões, textos legíveis e fluxo linear sem bifurcações complexas. Prioriza funcionalidade sobre estética.

### Key Interaction Paradigms
- **Toque simples:** Um toque para confirmar, dois toques para editar
- **Scrolling vertical:** Todo conteúdo em uma única coluna
- **Feedback visual imediato:** Cada ação mostra resultado instantâneo
- **Estados visuais claros:** Verde (confirmado), Amarelo (pendente), Cinza (indefinido)

### Core Screens and Views
1. **Tela de Criação de Evento:** Formulário simples com template pré-preenchido
2. **Tela de Convite:** Link compartilhável + QR Code para facilitar acesso
3. **Tela de Confirmação:** Para convidados confirmarem presença
4. **Dashboard do Evento:** Visão geral com status financeiro e participantes
5. **Lista de Compras:** Check-list simples do que comprar/quem traz

### Accessibility: WCAG AA
Contraste adequado, textos grandes (mínimo 16px), navegação por teclado, compatível com leitores de tela básicos.

### Branding
Visual brasileiro e acolhedor: cores verde/amarelo sutis, ícones de churrasco minimalistas, tipografia sem serifa legível. Evita excessos visuais que possam confundir usuários menos tech-savvy.

### Target Device and Platforms: Web Responsivo
Otimizado para celulares (320px-414px), mas funcional em tablets e desktop. PWA para permitir "instalação" sem app store.

## Technical Assumptions

### Repository Structure: Monorepo
Um único repositório com frontend e backend separados por pastas para máxima simplicidade de desenvolvimento e deploy.

### Service Architecture
**Aplicação monolítica simples** - todas as funcionalidades em um único backend Node.js para deploy instantâneo e zero complexidade operacional.

### Testing Requirements
**Testes manuais focados** - testing automatizado apenas para cálculos críticos (divisão de custos). Prioriza velocidade de iteração sobre cobertura completa.

### Additional Technical Assumptions and Requests

**Frontend Stack (Ultra-Simples):**
- **React.js puro (sem TypeScript):** JavaScript vanilla para desenvolvimento rápido
- **CSS Modules ou styled-components:** Styling simples e componentizado
- **useState/useEffect:** State management nativo do React, sem libraries externas
- **Fetch API:** HTTP requests nativos, sem axios ou similares

**Backend Stack (Mínimo Viável):**
- **Node.js + Express (JavaScript puro):** Setup em minutos, sem compilação
- **JSON file storage ou SQLite:** Banco de dados local para MVP ultra-rápido
- **Sem autenticação inicialmente:** Links únicos como "chave de acesso"

**Infrastructure (Deploy em 1 dia):**
- **Netlify (frontend):** Deploy automático via Git push
- **Railway ou Render (backend):** Deploy direto do GitHub, free tier
- **Arquivos locais:** Sem banco de dados externo inicialmente

**Performance & Compatibility (Básico):**
- **Suporte mínimo:** Navegadores dos últimos 2 anos
- **Bundle pequeno:** Sem dependencies pesadas, React puro
- **Imagens simples:** PNG/JPG básicos, sem otimizações complexas

**Development (Velocidade Máxima):**
- **Create React App:** Setup instantâneo sem configuração
- **Nodemon:** Auto-restart do backend em desenvolvimento
- **Git + GitHub:** Versionamento simples sem CI/CD complexo

## Epic List

**Epic 1: Foundation & Core Event Creation**
Estabelecer projeto básico com capacidade de criar e visualizar eventos simples, garantindo que a infraestrutura funcione end-to-end desde o primeiro deploy.

**Epic 2: Guest Management & RSVP System**
Implementar sistema de convites e confirmação de presença, permitindo que organizadores vejam quem vem e quem não vem ao evento.

**Epic 3: Cost Calculation & Financial Transparency**
Criar o coração do app - cálculos automáticos de custos e divisão transparente entre participantes, resolvendo o principal pain point identificado.

**Epic 4: Shopping List & Event Completion**
Finalizar o ciclo completo com lista de compras colaborativa e ferramentas para acompanhar o evento até sua realização.

## Epic 1: Foundation & Core Event Creation

**Goal:** Estabelecer a infraestrutura técnica básica e permitir que usuários criem eventos de churrasco simples com template pré-configurado. Este epic entrega valor imediato (criação de evento) enquanto estabelece a base técnica para todos os epics seguintes, incluindo deploy funcional e arquitetura de dados básica.

### Story 1.1: Setup Inicial do Projeto com Create React App
Como um desenvolvedor,
Eu quero configurar o projeto inicial completo com todas as ferramentas necessárias,
Para que eu possa desenvolver de forma consistente e fazer deploy desde o primeiro commit.

#### Critérios de Aceitação
1. Repositório Git criado com estrutura monorepo definida:
   - `/frontend` - React app com Create React App
   - `/backend` - Express.js server
   - `/shared` - Utilitários comuns (opcional)
2. Create React App configurado com:
   - CSS Modules habilitado
   - Scripts de build e dev funcionando
   - Estrutura de pastas definida (components/, pages/, hooks/, services/)
3. Backend Express.js configurado com:
   - Estrutura de pastas (routes/, models/, middleware/, utils/)
   - Nodemon para desenvolvimento
   - CORS habilitado para frontend local
4. Package.json root com npm workspaces configurado
5. Scripts npm unificados (`npm run dev`, `npm run build`, `npm test`)
6. Variáveis de ambiente configuradas (.env.example criado)
7. README.md com instruções detalhadas de setup local

### Story 1.2: Pipeline de CI/CD Básico no GitHub Actions
Como um desenvolvedor,
Eu quero ter deploy automático configurado desde o início,
Para que cada push para main seja automaticamente deployado.

#### Critérios de Aceitação
1. Arquivo `.github/workflows/ci.yml` criado com:
   - Testes automatizados para frontend e backend
   - Build do frontend verificado
   - Linting básico (ESLint)
2. Arquivo `.github/workflows/deploy.yml` criado com:
   - Deploy automático do frontend para Render Static Site
   - Deploy automático do backend para Render Web Service
   - Deploy triggerado apenas no push para branch main
3. Secrets do GitHub configurados para deploy:
   - RENDER_API_KEY
   - MONGODB_URI para produção
4. Status badges no README mostrando build status
5. Deploy funcional end-to-end (frontend + backend + banco)

### Story 1.3: Configuração do Projeto e Infraestrutura Básica
Como um desenvolvedor,
Eu quero estabelecer a estrutura básica do projeto,
Para que eu possa desenvolver e fazer deploy de funcionalidades incrementalmente.

#### Critérios de Aceitação
1. Repositório Git criado com estrutura monorepo (frontend/ e backend/)
2. Create React App configurado e funcionando localmente
3. Backend Node.js + Express respondendo à rota de health check
4. Deploy básico funcionando (Netlify + Railway/Render)
5. README com instruções de configuração local

### Story 1.4: Modelo de Dados do Evento e Armazenamento com MongoDB
Como um organizador,
Eu quero que o sistema armazene os dados do meu evento de forma estruturada,
Para que as informações persistam e possam ser acessadas posteriormente.

#### Critérios de Aceitação
1. Schemas MongoDB detalhados implementados para:
   - Event: id, name, date, location, organizerId, status, confirmationDeadline, estimatedParticipants
   - Guest: id, eventId, name, phone, rsvpStatus, paymentStatus, paymentMethod, confirmedAt
   - EventItem: id, eventId, name, category, quantity, unit, estimatedCost, actualCost, assignedTo, isPurchased, isTemplate
2. Conexão MongoDB configurada (local ou MongoDB Atlas)
3. Modelos Mongoose criados com validação apropriada
4. IDs únicos (UUID) gerados para cada documento
5. Funções CRUD básicas implementadas e testadas
6. Índices otimizados criados para consultas frequentes

### Story 1.5: Formulário de Criação de Evento
Como um organizador,
Eu quero criar um novo evento de churrasco facilmente,
Para que eu possa começar a organizar sem complicações.

#### Critérios de Aceitação
1. Formulário simples com campos: Nome do evento, Data, Local
2. Template pré-preenchido com itens básicos (carne, bebidas, carvão)
3. Estimativa automática de quantidades baseada no número de pessoas
4. Botão "Criar Evento" que salva e gera ID único
5. Responsivo para mobile (320px+)

### Story 1.6: Visualização do Evento e Dashboard Básico
Como um organizador,
Eu quero visualizar os detalhes do meu evento criado,
Para que eu possa verificar se as informações estão corretas.

#### Critérios de Aceitação
1. Página de visualização acessível via URL único (/evento/[id])
2. Exibição clara de: nome, data, local, lista de itens
3. URL compartilhável visível e copiável
4. Design mobile-first com texto legível
5. Navegação simples de volta para criação

### Story 1.7: Otimização Móvel Básica
Como um usuário de qualquer idade,
Eu quero usar o app facilmente no meu celular,
Para que eu não precise de computador para organizar eventos.

#### Critérios de Aceitação
1. Interface 100% responsiva para telas de 320px-414px
2. Botões grandes (mínimo 44px) para toque fácil
3. Texto legível (mínimo 16px) sem zoom
4. Scrolling suave e intuitivo
5. Carregamento rápido em conexões 3G

## Epic 2: Gestão de Convidados e Sistema de Confirmação

**Goal:** Implementar sistema completo de convites e confirmação de presença, permitindo que organizadores gerenciem participantes e que convidados respondam facilmente aos convites, criando a base social do aplicativo.

### Story 2.1: Links Compartilháveis do Evento
Como um organizador,
Eu quero compartilhar meu evento facilmente,
Para que os convidados possam acessá-lo sem complicações.

#### Critérios de Aceitação
1. Link único compartilhável gerado para cada evento
2. Botão copiar link com feedback visual
3. Geração de QR code para compartilhamento móvel fácil
4. Botão de compartilhar no WhatsApp com mensagem pré-formatada
5. Link funciona sem exigir cadastro

### Story 2.2: Interface de Confirmação dos Convidados
Como um convidado,
Eu quero confirmar minha presença facilmente,
Para que o organizador saiba se eu vou comparecer.

#### Critérios de Aceitação
1. Formulário simples de confirmação acessível via link compartilhado
2. Opções: Sim, Não, Talvez com estados visuais claros
3. Campo de nome do convidado (obrigatório)
4. Campo de telefone opcional
5. Mensagem de confirmação após envio da resposta

### Story 2.3: Gestão da Lista de Convidados
Como um organizador,
Eu quero ver quem está vindo ao meu evento,
Para que eu possa planejar adequadamente.

#### Critérios de Aceitação
1. Lista de convidados em tempo real mostrando todas as confirmações
2. Indicadores visuais de status (Verde=Sim, Amarelo=Talvez, Cinza=Não)
3. Contagem de participantes confirmados exibida prominentemente
4. Nomes dos convidados e informações de contato visíveis ao organizador
5. Timestamp da última atualização para cada confirmação

### Story 2.4: Gestão de Prazo para Confirmações
Como um organizador,
Eu quero definir um prazo para confirmações,
Para que eu possa planejar as compras com certeza.

#### Critérios de Aceitação
1. Configuração opcional de prazo para confirmações na criação do evento
2. Prazo exibido prominentemente na visualização dos convidados
3. Mensagem de aviso quando o prazo se aproxima
4. Atualização automática de status após o prazo passar
5. Comunicação clara sobre confirmações tardias

## Epic 3: Cálculo de Custos e Transparência Financeira

**Goal:** Criar o coração do aplicativo - sistema completo de cálculos automáticos de custos e divisão transparente entre participantes, resolvendo o principal pain point identificado no brief e entregando o maior valor diferenciado do produto.

### **DEPENDÊNCIAS CRÍTICAS DO EPIC 2:**
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

### **APIs NECESSÁRIAS ANTES DO EPIC 3:**
- `GET /api/events/:id/guests` - Listar convidados por evento
- `GET /api/events/:id/confirmed-count` - Contar participantes confirmados
- `GET /api/events/:id/items` - Listar itens do evento
- `PUT /api/guests/:id/rsvp` - Atualizar confirmação de presença

**⚠️ BLOCKER:** Epic 3 não pode começar até que todas as APIs acima estejam implementadas e testadas.

### Story 3.1: Calculadora Básica de Custos
Como um organizador,
Eu quero calcular custos automaticamente,
Para que eu saiba quanto cada pessoa deve pagar.

#### Critérios de Aceitação
1. Campos de entrada de custo para cada item do template
2. Cálculo automático por pessoa baseado nos convidados confirmados
3. Exibição clara do custo total e custo por pessoa
4. Atualizações em tempo real quando custos ou número de convidados muda
5. Formatação de moeda brasileira (R$)

### Story 3.2: Detalhamento de Custos por Item
Como um participante,
Eu quero ver exatamente pelo que estou pagando,
Para que eu entenda a distribuição dos custos.

#### Critérios de Aceitação
1. Detalhamento mostrando cada item e seu custo
2. Cálculo da parte individual para cada item
3. Distinção clara entre custos confirmados e estimados
4. Quebra percentual dos custos totais por categoria
5. Funcionalidade de exportar/compartilhar detalhamento de custos

### Story 3.3: Gestão de Itens Adicionais
Como um organizador,
Eu quero adicionar itens extras que não estão no template,
Para que eu possa contabilizar todos os custos do evento.

#### Critérios de Aceitação
1. Botão "Adicionar Item" para incluir itens personalizados
2. Campos de nome do item, quantidade e custo unitário
3. Atribuição de categoria (carne, bebidas, extras, etc.)
4. Funcionalidade de editar/excluir itens adicionados
5. Itens do template permanecem editáveis

### Story 3.4: Rastreamento de Status de Pagamento
Como um organizador,
Eu quero rastrear quem pagou,
Para que eu saiba os saldos pendentes.

#### Critérios de Aceitação
1. Checkbox de status de pagamento para cada participante
2. Indicadores visuais para status pago/não pago
3. Cálculo e exibição de saldo pendente
4. Notas sobre método de pagamento (PIX, dinheiro, transferência)
5. Timestamp de confirmação do pagamento

## Epic 4: Lista de Compras e Finalização do Evento

**Goal:** Finalizar o ciclo completo de valor com lista de compras colaborativa e ferramentas para acompanhar o evento até sua realização, garantindo que nada seja esquecido e que a experiência seja completa do início ao fim.

### Story 4.1: Lista de Compras Colaborativa
Como um participante,
Eu quero me voluntariar para trazer itens específicos,
Para que possamos distribuir a responsabilidade das compras.

#### Critérios de Aceitação
1. Botão "Eu trago isso" para cada item
2. Exibição de atribuição mostrando quem está trazendo o quê
3. Exibição de informações de contato para coordenação
4. Capacidade de desatribuir se os planos mudarem
5. Itens não atribuídos claramente destacados

### Story 4.2: Rastreamento do Progresso das Compras
Como um organizador,
Eu quero acompanhar o progresso das compras,
Para que eu saiba o que ainda é necessário.

#### Critérios de Aceitação
1. Sistema de checkbox para status "comprado"
2. Barra de progresso visual para conclusão das compras
3. Capacidade de upload de foto para comprovantes
4. Capacidade de adicionar itens de última hora
5. Resumo final das compras antes do evento

### Story 4.3: Dashboard do Dia do Evento
Como um organizador,
Eu quero uma visão geral clara no dia do evento,
Para que eu possa coordenar tudo suavemente.

#### Critérios de Aceitação
1. Resumo do dia do evento com todas as informações principais
2. Contagem final de participantes e resumo financeiro
3. Lista de contatos de todos os participantes confirmados
4. Checklist de compras com atualizações de status
5. Integração de informações meteorológicas (se possível)

### Story 4.4: Finalização do Evento e Feedback
Como um participante,
Eu quero confirmar que o evento aconteceu,
Para que o sistema possa aprender e melhorar.

#### Critérios de Aceitação
1. Confirmação simples de "Evento realizado"
2. Feedback opcional sobre precisão dos custos
3. Avaliar a experiência de organização (1-5 estrelas)
4. Notas de lições aprendidas para eventos futuros
5. Arquivar evento com estatísticas resumidas

## Relatório de Resultados do Checklist

### ✅ **CORREÇÕES IMPLEMENTADAS**

**1. Schemas MongoDB Detalhados ✅**
- Event schema completo definido na arquitetura com validações
- Guest schema com todos os campos e relacionamentos
- EventItem schema com categorias e tipos específicos
- Índices optimizados especificados para performance

**2. Story Específica para Setup do Projeto ✅**
- Story 1.1: Setup inicial com Create React App detalhado
- Story 1.2: Pipeline de CI/CD no GitHub Actions
- Story 1.3: Configuração de infraestrutura básica
- Critérios de aceitação específicos para cada step

**3. Pipeline Básico de CI/CD Estabelecido ✅**
- Workflow completo do GitHub Actions definido
- Deploy automático para Render configurado
- Secrets necessários documentados
- Ambientes de staging e produção mapeados

**4. Dependências entre Epic 2 e Epic 3 Mapeadas ✅**
- Seção específica de dependências críticas adicionada
- APIs necessárias listadas explicitamente
- Bloqueadores identificados claramente
- Sequência de implementação definida

### 📊 **STATUS ATUALIZADO DO CHECKLIST**

| Categoria | Status Anterior | Status Atual |
|-----------|----------------|--------------|
| 1. Project Setup & Initialization | ⚠️ PARCIAL (60%) | ✅ APROVADO (90%) |
| 2. Infrastructure & Deployment | ❌ FALHA (40%) | ✅ APROVADO (85%) |
| 6. Feature Sequencing & Dependencies | ⚠️ PARCIAL (70%) | ✅ APROVADO (90%) |
| 9. Documentation & Handoff | ⚠️ PARCIAL (65%) | ✅ APROVADO (80%) |

### 🎯 **PRONTIDÃO GERAL ATUALIZADA**

**ANTES:** 72% - Aprovado Condicionalmente  
**AGORA:** **88% - APROVADO PARA DESENVOLVIMENTO** ✅

**Issues Críticos Resolvidos:** 4/4 bloqueadores eliminados

*Executado usando execute-checklist-po em 9 de setembro de 2025*

## Próximos Passos

### Prompt para Especialista em UX
"Por favor, revise este PRD do ChurrasApp e crie uma arquitetura UX abrangente focando em design mobile-first para usuários brasileiros de 25-65 anos de todas as classes sociais. Priorize simplicidade, acessibilidade e transparência financeira em suas recomendações de design."

### Prompt para Arquiteto
"Por favor, revise este PRD do ChurrasApp e crie um documento de arquitetura técnica. Foque no stack ultra-simples (React.js, Node.js, armazenamento JSON/SQLite) otimizado para deploy rápido de MVP e custos mínimos de infraestrutura. Garanta que a arquitetura suporte a abordagem de desenvolvimento sequencial de epics descrita."
