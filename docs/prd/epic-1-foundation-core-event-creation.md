# Epic 1: Foundation & Core Event Creation

**Goal:** Estabelecer a infraestrutura técnica básica e permitir que usuários criem eventos de churrasco simples com template pré-configurado. Este epic entrega valor imediato (criação de evento) enquanto estabelece a base técnica para todos os epics seguintes, incluindo deploy funcional e arquitetura de dados básica.

## Story 1.1: Setup Inicial do Projeto com Create React App
Como um desenvolvedor,
Eu quero configurar o projeto inicial completo com todas as ferramentas necessárias,
Para que eu possa desenvolver de forma consistente e fazer deploy desde o primeiro commit.

### Critérios de Aceitação
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

## Story 1.2: Pipeline de CI/CD Básico no GitHub Actions
Como um desenvolvedor,
Eu quero ter deploy automático configurado desde o início,
Para que cada push para main seja automaticamente deployado.

### Critérios de Aceitação
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

## Story 1.3: Configuração do Projeto e Infraestrutura Básica
Como um desenvolvedor,
Eu quero estabelecer a estrutura básica do projeto,
Para que eu possa desenvolver e fazer deploy de funcionalidades incrementalmente.

### Critérios de Aceitação
1. Repositório Git criado com estrutura monorepo (frontend/ e backend/)
2. Create React App configurado e funcionando localmente
3. Backend Node.js + Express respondendo à rota de health check
4. Deploy básico funcionando (Netlify + Railway/Render)
5. README com instruções de configuração local

## Story 1.4: Modelo de Dados do Evento e Armazenamento com MongoDB
Como um organizador,
Eu quero que o sistema armazene os dados do meu evento de forma estruturada,
Para que as informações persistam e possam ser acessadas posteriormente.

### Critérios de Aceitação
1. Schemas MongoDB detalhados implementados para:
   - Event: id, name, date, location, organizerId, status, confirmationDeadline, estimatedParticipants
   - Guest: id, eventId, name, phone, rsvpStatus, paymentStatus, paymentMethod, confirmedAt
   - EventItem: id, eventId, name, category, quantity, unit, estimatedCost, actualCost, assignedTo, isPurchased, isTemplate
2. Conexão MongoDB configurada (local ou MongoDB Atlas)
3. Modelos Mongoose criados com validação apropriada
4. IDs únicos (UUID) gerados para cada documento
5. Funções CRUD básicas implementadas e testadas
6. Índices otimizados criados para consultas frequentes

## Story 1.5: Formulário de Criação de Evento
Como um organizador,
Eu quero criar um novo evento de churrasco facilmente,
Para que eu possa começar a organizar sem complicações.

### Critérios de Aceitação
1. Formulário simples com campos: Nome do evento, Data, Local
2. Template pré-preenchido com itens básicos (carne, bebidas, carvão)
3. Estimativa automática de quantidades baseada no número de pessoas
4. Botão "Criar Evento" que salva e gera ID único
5. Responsivo para mobile (320px+)

## Story 1.6: Visualização do Evento e Dashboard Básico
Como um organizador,
Eu quero visualizar os detalhes do meu evento criado,
Para que eu possa verificar se as informações estão corretas.

### Critérios de Aceitação
1. Página de visualização acessível via URL único (/evento/[id])
2. Exibição clara de: nome, data, local, lista de itens
3. URL compartilhável visível e copiável
4. Design mobile-first com texto legível
5. Navegação simples de volta para criação

## Story 1.7: Otimização Móvel Básica
Como um usuário de qualquer idade,
Eu quero usar o app facilmente no meu celular,
Para que eu não precise de computador para organizar eventos.

### Critérios de Aceitação
1. Interface 100% responsiva para telas de 320px-414px
2. Botões grandes (mínimo 44px) para toque fácil
3. Texto legível (mínimo 16px) sem zoom
4. Scrolling suave e intuitivo
5. Carregamento rápido em conexões 3G
