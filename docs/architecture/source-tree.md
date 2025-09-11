# ChurrasApp - Estrutura da Árvore de Código

## Visão Geral

Este documento define a estrutura completa da árvore de código para o ChurrasApp, um projeto monorepo com frontend React.js e backend Node.js/Express. A estrutura foi otimizada para desenvolvimento rápido, manutenibilidade e clareza de organização.

## Estrutura Completa do Projeto

```
churrasapp/
├── .github/                           # Configurações GitHub
│   └── workflows/
│       ├── ci.yaml                    # CI/CD - Testes automatizados
│       └── deploy.yaml                # Deploy automático para Render
│
├── apps/                              # Aplicações principais
│   ├── web/                          # Frontend React.js
│   │   ├── public/                   # Assets estáticos
│   │   │   ├── index.html
│   │   │   ├── manifest.json         # PWA manifest
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   │   ├── components/           # Componentes React organizados por domínio
│   │   │   │   ├── common/           # Componentes reutilizáveis
│   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Button.jsx
│   │   │   │   │   │   ├── Button.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── Input/
│   │   │   │   │   │   ├── Input.jsx
│   │   │   │   │   │   ├── Input.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── Loading/
│   │   │   │   │   │   ├── Loading.jsx
│   │   │   │   │   │   ├── Loading.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── Modal/
│   │   │   │   │       ├── Modal.jsx
│   │   │   │   │       ├── Modal.module.css
│   │   │   │   │       └── index.js
│   │   │   │   ├── event/            # Componentes de eventos
│   │   │   │   │   ├── EventForm/
│   │   │   │   │   │   ├── EventForm.jsx
│   │   │   │   │   │   ├── EventForm.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── EventDashboard/
│   │   │   │   │   │   ├── EventDashboard.jsx
│   │   │   │   │   │   ├── EventDashboard.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── ShareEvent/
│   │   │   │   │   │   ├── ShareEvent.jsx
│   │   │   │   │   │   ├── ShareEvent.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── EventCard/
│   │   │   │   │       ├── EventCard.jsx
│   │   │   │   │       ├── EventCard.module.css
│   │   │   │   │       └── index.js
│   │   │   │   ├── guest/            # Componentes de convidados
│   │   │   │   │   ├── GuestList/
│   │   │   │   │   │   ├── GuestList.jsx
│   │   │   │   │   │   ├── GuestList.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── RSVPForm/
│   │   │   │   │   │   ├── RSVPForm.jsx
│   │   │   │   │   │   ├── RSVPForm.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── GuestCard/
│   │   │   │   │   │   ├── GuestCard.jsx
│   │   │   │   │   │   ├── GuestCard.module.css
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── GuestStatus/
│   │   │   │   │       ├── GuestStatus.jsx
│   │   │   │   │       ├── GuestStatus.module.css
│   │   │   │   │       └── index.js
│   │   │   │   └── cost/             # Componentes de custos
│   │   │   │       ├── CostCalculator/
│   │   │   │       │   ├── CostCalculator.jsx
│   │   │   │       │   ├── CostCalculator.module.css
│   │   │   │       │   └── index.js
│   │   │   │       ├── CostBreakdown/
│   │   │   │       │   ├── CostBreakdown.jsx
│   │   │   │       │   ├── CostBreakdown.module.css
│   │   │   │       │   └── index.js
│   │   │   │       ├── PaymentTracker/
│   │   │   │       │   ├── PaymentTracker.jsx
│   │   │   │       │   ├── PaymentTracker.module.css
│   │   │   │       │   └── index.js
│   │   │   │       └── ShoppingList/
│   │   │   │           ├── ShoppingList.jsx
│   │   │   │           ├── ShoppingList.module.css
│   │   │   │           └── index.js
│   │   │   ├── pages/                # Páginas/Rotas principais
│   │   │   │   ├── Home/
│   │   │   │   │   ├── Home.jsx
│   │   │   │   │   ├── Home.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── CreateEvent/
│   │   │   │   │   ├── CreateEvent.jsx
│   │   │   │   │   ├── CreateEvent.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── EventDetails/
│   │   │   │   │   ├── EventDetails.jsx
│   │   │   │   │   ├── EventDetails.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── RSVP/
│   │   │   │   │   ├── RSVP.jsx
│   │   │   │   │   ├── RSVP.module.css
│   │   │   │   │   └── index.js
│   │   │   │   └── NotFound/
│   │   │   │       ├── NotFound.jsx
│   │   │   │       ├── NotFound.module.css
│   │   │   │       └── index.js
│   │   │   ├── hooks/                # Custom React Hooks
│   │   │   │   ├── useEvent.js       # Hook para gerenciar estado de eventos
│   │   │   │   ├── useGuests.js      # Hook para gerenciar convidados
│   │   │   │   ├── useCosts.js       # Hook para cálculos de custo
│   │   │   │   ├── useLocalStorage.js # Hook para localStorage
│   │   │   │   └── useApi.js         # Hook para chamadas de API
│   │   │   ├── services/             # Camada de serviços/API
│   │   │   │   ├── api.js            # Cliente HTTP base
│   │   │   │   ├── eventService.js   # Serviços de eventos
│   │   │   │   ├── guestService.js   # Serviços de convidados
│   │   │   │   ├── costService.js    # Serviços de cálculos
│   │   │   │   └── shareService.js   # Serviços de compartilhamento
│   │   │   ├── context/              # React Context para estado global
│   │   │   │   ├── AppContext.js     # Context principal da aplicação
│   │   │   │   ├── EventContext.js   # Context específico de eventos
│   │   │   │   └── AuthContext.js    # Context de autenticação simples
│   │   │   ├── styles/               # Estilos globais e temas
│   │   │   │   ├── globals.css       # Estilos globais base
│   │   │   │   ├── variables.css     # Variáveis CSS
│   │   │   │   ├── responsive.css    # Media queries globais
│   │   │   │   └── themes.css        # Temas de cores
│   │   │   ├── utils/                # Utilitários frontend
│   │   │   │   ├── formatters.js     # Formatação de dados (datas, moeda)
│   │   │   │   ├── validators.js     # Validações frontend
│   │   │   │   ├── constants.js      # Constantes da aplicação
│   │   │   │   ├── helpers.js        # Funções auxiliares gerais
│   │   │   │   └── errorHandler.js   # Tratamento de erros
│   │   │   ├── App.js                # Componente raiz da aplicação
│   │   │   ├── App.css               # Estilos do App
│   │   │   ├── index.js              # Entry point da aplicação
│   │   │   └── index.css             # Estilos base do index
│   │   ├── tests/                    # Testes frontend
│   │   │   ├── components/           # Testes de componentes
│   │   │   │   ├── EventForm.test.js
│   │   │   │   ├── GuestList.test.js
│   │   │   │   └── CostCalculator.test.js
│   │   │   ├── hooks/                # Testes de hooks
│   │   │   │   ├── useEvent.test.js
│   │   │   │   └── useGuests.test.js
│   │   │   ├── services/             # Testes de serviços
│   │   │   │   └── api.test.js
│   │   │   ├── utils/                # Testes de utilitários
│   │   │   │   └── formatters.test.js
│   │   │   └── setupTests.js         # Configuração dos testes
│   │   ├── .env.local                # Variáveis de ambiente locais
│   │   ├── package.json              # Dependências e scripts frontend
│   │   └── README.md                 # Documentação específica do frontend
│   │
│   └── api/                          # Backend Node.js/Express
│       ├── src/
│       │   ├── routes/               # Rotas da API organizadas por domínio
│       │   │   ├── index.js          # Router principal
│       │   │   ├── events.js         # Rotas de eventos
│       │   │   ├── guests.js         # Rotas de convidados
│       │   │   ├── items.js          # Rotas de itens do evento
│       │   │   ├── calculations.js   # Rotas de cálculos
│       │   │   └── health.js         # Health check endpoints
│       │   ├── controllers/          # Controllers/Handlers das rotas
│       │   │   ├── eventController.js    # Lógica de controle de eventos
│       │   │   ├── guestController.js    # Lógica de controle de convidados
│       │   │   ├── itemController.js     # Lógica de controle de itens
│       │   │   ├── calculationController.js # Lógica de cálculos
│       │   │   └── healthController.js   # Health check controller
│       │   ├── services/             # Lógica de negócio
│       │   │   ├── eventService.js   # Serviços de eventos
│       │   │   ├── guestService.js   # Serviços de convidados
│       │   │   ├── itemService.js    # Serviços de itens
│       │   │   ├── costCalculator.js # Calculadora de custos
│       │   │   ├── linkGenerator.js  # Gerador de links únicos
│       │   │   └── templateService.js # Serviço de templates de itens
│       │   ├── models/               # Modelos de dados (Mongoose)
│       │   │   ├── Event.js          # Modelo de evento
│       │   │   ├── Guest.js          # Modelo de convidado
│       │   │   ├── EventItem.js      # Modelo de item do evento
│       │   │   └── index.js          # Exportações dos modelos
│       │   ├── middleware/           # Middlewares Express
│       │   │   ├── auth.js           # Middleware de autenticação simples
│       │   │   ├── validation.js     # Middleware de validação
│       │   │   ├── errorHandler.js   # Middleware de tratamento de erros
│       │   │   ├── cors.js           # Configuração CORS
│       │   │   ├── rateLimit.js      # Rate limiting
│       │   │   └── logger.js         # Middleware de logging
│       │   ├── config/               # Configurações
│       │   │   ├── database.js       # Configuração MongoDB
│       │   │   ├── server.js         # Configurações do servidor
│       │   │   └── constants.js      # Constantes do backend
│       │   ├── utils/                # Utilitários backend
│       │   │   ├── database.js       # Utilitários de database
│       │   │   ├── helpers.js        # Funções auxiliares
│       │   │   ├── validators.js     # Validadores customizados
│       │   │   └── errorTypes.js     # Tipos de erro customizados
│       │   ├── app.js                # Configuração do Express app
│       │   └── server.js             # Entry point do servidor
│       ├── tests/                    # Testes backend
│       │   ├── controllers/          # Testes de controllers
│       │   │   ├── eventController.test.js
│       │   │   └── guestController.test.js
│       │   ├── services/             # Testes de serviços
│       │   │   ├── eventService.test.js
│       │   │   └── costCalculator.test.js
│       │   ├── models/               # Testes de modelos
│       │   │   └── Event.test.js
│       │   ├── integration/          # Testes de integração
│       │   │   └── eventFlow.test.js
│       │   └── setup.js              # Configuração dos testes
│       ├── .env                      # Variáveis de ambiente
│       ├── .env.example              # Template de variáveis de ambiente
│       ├── package.json              # Dependências e scripts backend
│       └── README.md                 # Documentação específica do backend
│
├── packages/                         # Pacotes compartilhados (npm workspaces)
│   ├── shared/                       # Utilitários compartilhados
│   │   ├── src/
│   │   │   ├── constants/            # Constantes compartilhadas
│   │   │   │   ├── eventTypes.js     # Tipos e status de eventos
│   │   │   │   ├── guestTypes.js     # Tipos e status de convidados
│   │   │   │   └── validation.js     # Regras de validação compartilhadas
│   │   │   ├── utils/                # Utilitários compartilhados
│   │   │   │   ├── formatters.js     # Formatadores compartilhados
│   │   │   │   ├── validators.js     # Validadores compartilhados
│   │   │   │   └── calculations.js   # Cálculos compartilhados
│   │   │   └── types/                # Definições de tipos (JSDoc)
│   │   │       ├── Event.js          # Tipos de evento
│   │   │       ├── Guest.js          # Tipos de convidado
│   │   │       └── Common.js         # Tipos comuns
│   │   ├── package.json              # Configuração do pacote shared
│   │   └── README.md                 # Documentação do pacote shared
│   │
│   └── config/                       # Configurações compartilhadas
│       ├── eslint/                   # Configurações ESLint
│       │   ├── base.js               # Configuração base
│       │   ├── frontend.js           # Configuração específica frontend
│       │   └── backend.js            # Configuração específica backend
│       ├── jest/                     # Configurações Jest
│       │   ├── base.js               # Configuração base de testes
│       │   ├── frontend.js           # Configuração testes frontend
│       │   └── backend.js            # Configuração testes backend
│       └── package.json              # Configuração do pacote config
│
├── scripts/                          # Scripts de build e deploy
│   ├── build.sh                      # Script de build geral
│   ├── deploy.sh                     # Script de deploy
│   ├── dev.sh                        # Script para desenvolvimento local
│   ├── test.sh                       # Script para executar todos os testes
│   └── db-init.sh                    # Script para inicializar database local
│
├── docs/                             # Documentação completa
│   ├── prd.md                        # Product Requirements Document
│   ├── architecture.md               # Documento de arquitetura principal
│   ├── prd/                          # PRD fragmentado
│   │   ├── epic-1-foundation-core-event-creation.md
│   │   ├── epic-2-gesto-de-convidados-e-sistema-de-confirmao.md
│   │   ├── epic-3-clculo-de-custos-e-transparncia-financeira.md
│   │   ├── epic-4-lista-de-compras-e-finalizao-do-evento.md
│   │   └── ...
│   ├── architecture/                 # Arquitetura fragmentada
│   │   ├── api-specification.md      # Especificação da API
│   │   ├── backend-architecture.md   # Arquitetura do backend
│   │   ├── frontend-architecture.md  # Arquitetura do frontend
│   │   ├── database-schema.md        # Schema do banco de dados
│   │   ├── deployment-architecture.md # Arquitetura de deploy
│   │   ├── security-and-performance.md # Segurança e performance
│   │   ├── testing-strategy.md       # Estratégia de testes
│   │   ├── coding-standards.md       # Padrões de código
│   │   ├── tech-stack.md            # Stack tecnológica
│   │   └── source-tree.md           # Este arquivo
│   └── api/                         # Documentação da API
│       ├── endpoints.md             # Documentação dos endpoints
│       └── examples.md              # Exemplos de uso da API
│
├── .env.example                     # Template de variáveis de ambiente raiz
├── .gitignore                       # Arquivos ignorados pelo Git
├── .eslintrc.js                     # Configuração ESLint raiz
├── .prettierrc                      # Configuração Prettier
├── package.json                     # Package.json raiz (workspaces)
├── package-lock.json                # Lock file do npm
├── README.md                        # Documentação principal do projeto
└── LICENSE                          # Licença do projeto
```

## Convenções de Nomenclatura

### Arquivos e Diretórios

- **Componentes React**: PascalCase (`EventForm.jsx`)
- **Arquivos JavaScript**: camelCase (`eventService.js`)
- **Arquivos CSS**: kebab-case (`event-form.module.css`)
- **Diretórios**: kebab-case para URLs, camelCase para funcionalidades (`event-details/`, `eventService/`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_PARTICIPANTS`)

### Estrutura de Componentes

Cada componente React segue a estrutura:
```
ComponentName/
├── ComponentName.jsx     # Componente principal
├── ComponentName.module.css # Estilos CSS Modules
├── ComponentName.test.js # Testes do componente (opcional)
└── index.js             # Barrel export
```

### Estrutura de Serviços

Cada serviço backend segue a estrutura:
```
- Controller: Recebe requests, valida entrada, chama service, retorna response
- Service: Contém lógica de negócio, chama models, retorna dados processados
- Model: Define schema e métodos de acesso a dados
```

## Pontos de Entrada

### Frontend (apps/web)
- **Entry Point**: `src/index.js`
- **App Root**: `src/App.js`
- **Routing**: Definido em `src/App.js` usando React Router

### Backend (apps/api)
- **Entry Point**: `src/server.js`
- **App Configuration**: `src/app.js`
- **Routes**: Definidas em `src/routes/index.js`

## Dependências Principais

### Frontend
- React 18.2+
- React Router DOM
- CSS Modules (nativo)
- Jest + React Testing Library

### Backend
- Node.js 18+
- Express.js 4.18+
- Mongoose (MongoDB ODM)
- Jest + Supertest

### Shared
- ESLint + Prettier
- Husky (Git hooks)
- npm workspaces

## Scripts Principais

### Desenvolvimento
```bash
npm run dev          # Inicia frontend + backend
npm run dev:web      # Apenas frontend
npm run dev:api      # Apenas backend
```

### Build
```bash
npm run build        # Build de produção completo
npm run build:web    # Build apenas frontend
npm run build:api    # Build apenas backend
```

### Testes
```bash
npm test            # Todos os testes
npm run test:web    # Testes frontend
npm run test:api    # Testes backend
npm run test:e2e    # Testes end-to-end (manual)
```

### Deploy
```bash
npm run deploy      # Deploy completo via CI/CD
npm run deploy:web  # Deploy apenas frontend
npm run deploy:api  # Deploy apenas backend
```

## Padrões de Importação

### Frontend
```javascript
// Componentes locais (relativo)
import EventForm from './EventForm';
import Button from '../common/Button';

// Serviços (absoluto via src)
import { eventService } from 'services/eventService';
import { formatCurrency } from 'utils/formatters';

// Bibliotecas externas
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
```

### Backend
```javascript
// Módulos locais (relativo)
const Event = require('./models/Event');
const eventService = require('../services/eventService');

// Configurações (absoluto)
const config = require('../config/database');

// Bibliotecas externas
const express = require('express');
const mongoose = require('mongoose');
```

## Estratégia de Versionamento

- **Semantic Versioning**: Major.Minor.Patch
- **Git Flow Simplificado**: 
  - `main` - produção
  - `develop` - desenvolvimento
  - `feature/*` - novas funcionalidades
- **Tags**: Utilizadas para releases de produção

## Observações Especiais

1. **CSS Modules**: Todos os estilos são scoped automaticamente
2. **npm Workspaces**: Gerenciamento centralizado de dependências
3. **Monorepo**: Frontend e backend compartilham configurações quando possível
4. **Environment Files**: Separados por ambiente e aplicação
5. **Testing**: Estratégia de pirâmide - muitos unit tests, alguns integration, poucos e2e
6. **Deployment**: Automático via GitHub Actions para Render

---

**Última Atualização**: 09 de setembro de 2025  
**Versão**: 1.0  
**Arquiteto**: Winston
