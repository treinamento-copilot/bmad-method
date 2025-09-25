# 🍖 ChurrasApp

**ChurrasApp** é uma aplicação web para organização de churrascos, permitindo gestão de convidados, cálculo de custos e criação de listas de compras de forma simples e transparente.

## 🚀 Tecnologias

- **Frontend**: React.js 18.2+ com Create React App
- **Backend**: Node.js 18+ com Express.js 4.18+
- **Database**: MongoDB 6.0+
- **Styling**: CSS Modules (nativo)
- **State Management**: React useState/useContext
- **Testing**: Jest + React Testing Library + Supertest

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** versão 18 ou superior
- **npm** versão 8 ou superior
- **MongoDB** (local ou connection string)

Verificar versões:

```bash
node --version  # deve ser >= 18.0.0
npm --version   # deve ser >= 8.0.0
```

## 🛠️ Setup Local

### Opção 1: Setup Tradicional (Node.js + MongoDB locais)

#### 1. Clone e Instale Dependências

```bash
# Clone o repositório
git clone <repository-url>
cd churrasapp

# Instale todas as dependências (frontend + backend)
npm install
```

#### 2. Configure Variáveis de Ambiente

```bash
# Copie o template de variáveis de ambiente
cp .env.example .env

# Configure as variáveis conforme necessário
# As configurações padrão funcionam para desenvolvimento local
```

#### 3. Inicie os Serviços

```bash
# Iniciar frontend + backend simultaneamente
npm run dev

# OU iniciar separadamente:
npm run dev:web    # Frontend apenas (porta 3000)
npm run dev:api    # Backend apenas (porta 3001)
```

#### 4. Acesse a Aplicação

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **Health Check**: <http://localhost:3001/health>

### Opção 2: Setup com Docker (Recomendado)

O Docker elimina problemas de configuração e garante consistência entre ambientes.

#### 🐳 Pré-requisitos Docker

```bash
# Instalar Docker e Docker Compose
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install docker.io docker-compose

# macOS:
brew install docker docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

#### 🚀 Início Rápido com Docker

```bash
# 1. Clone o repositório
git clone <repository-url>
cd churrasapp

# 2. Inicie todos os serviços (MongoDB + API)
npm run docker:up:build

# 3. Acesse a aplicação
# Frontend: http://localhost:3001 (se usar perfil fullstack)
# API: http://localhost:3000
# MongoDB: localhost:27017
```

#### 🔧 Comandos Docker Disponíveis

```bash
# === COMANDOS BÁSICOS ===
npm run docker:up              # Inicia todos os serviços
npm run docker:up:build        # Inicia e rebuilda containers
npm run docker:down            # Para todos os serviços
npm run docker:down:clean      # Para e remove volumes/networks

# === LOGS E DEBUGGING ===
npm run docker:logs            # Todos os logs em tempo real
npm run docker:logs:api        # Logs apenas da API
npm run docker:logs:db         # Logs apenas do MongoDB
npm run docker:health          # Status de todos os containers

# === REBUILD E MANUTENÇÃO ===
npm run docker:rebuild         # Para, rebuilda e inicia
npm run docker:shell:api       # Acessa shell do container da API
npm run docker:shell:db        # Acessa MongoDB shell
npm run docker:test:api        # Executa testes dentro do container
```

#### 📦 Serviços Docker

| Serviço | Porta Externa | Porta Interna | Descrição |
|---------|---------------|---------------|-----------|
| `mongodb` | 27017 | 27017 | Banco de dados MongoDB 6.0 |
| `api` | 3000 | 3000 | Backend Node.js com hot-reload |
| `web` | 3001 | 3000 | Frontend React (opcional, perfil fullstack) |

#### 🔄 Hot Reload no Docker

O ambiente Docker está configurado com volumes para hot-reload automático:

```bash
# Mudanças no código são automaticamente refletidas
# Edite arquivos em apps/api/src/ ou apps/web/src/
# Os containers detectam automaticamente as mudanças
```

#### 🗄️ Persistência de Dados

Os dados do MongoDB são persistentes entre reinicializações:

```bash
# Dados são mantidos mesmo após parar containers
npm run docker:down
npm run docker:up

# Para remover dados persistentes (CUIDADO!)
npm run docker:down:clean  # Remove volumes
```

#### 🔍 Troubleshooting Docker

```bash
# Verificar status dos containers
npm run docker:health

# Verificar logs em caso de erro
npm run docker:logs:api

# Rebuild completo se houver problemas
npm run docker:rebuild

# Verificar se portas estão livres
lsof -ti:3000
lsof -ti:27017

# Verificar espaço em disco (Docker pode consumir espaço)
docker system df
docker system prune  # Limpa recursos não utilizados
```

#### ⚙️ Configuração Avançada Docker

Para customizar configurações Docker, edite:

- `docker-compose.yml` - Orquestração de serviços
- `.env.docker` - Variáveis de ambiente Docker
- `apps/api/Dockerfile` - Build da API
- `apps/web/Dockerfile` - Build do frontend (se usar)

### 🎯 Qual Método Escolher?

| Cenário | Recomendação |
|---------|--------------|
| **Desenvolvimento rápido** | 🐳 Docker (setup instantâneo) |
| **Depuração avançada** | 🔧 Tradicional (mais controle) |
| **Primeiro uso** | 🐳 Docker (sem configuração manual) |
| **CI/CD** | 🐳 Docker (consistência) |
| **Produção local** | 🐳 Docker (isolamento) |

## 📁 Estrutura do Projeto

```
churrasapp/
├── apps/
│   ├── web/                    # Frontend React.js
│   │   ├── src/
│   │   │   ├── components/     # Componentes React
│   │   │   ├── pages/          # Páginas/Rotas
│   │   │   ├── hooks/          # Custom Hooks
│   │   │   ├── services/       # Chamadas de API
│   │   │   ├── context/        # React Context
│   │   │   ├── styles/         # Estilos globais
│   │   │   └── utils/          # Utilitários frontend
│   │   └── package.json
│   │
│   └── api/                    # Backend Node.js/Express
│       ├── src/
│       │   ├── routes/         # Rotas da API
│       │   ├── models/         # Modelos de dados
│       │   ├── middleware/     # Middlewares Express
│       │   ├── services/       # Lógica de negócio
│       │   └── utils/          # Utilitários backend
│       └── package.json
│
├── packages/
│   └── shared/                 # Código compartilhado
│
├── package.json                # Configuração do monorepo
└── README.md                   # Este arquivo
```

## 🎯 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia frontend + backend
npm run dev:web      # Inicia apenas frontend
npm run dev:api      # Inicia apenas backend
```

### Build
```bash
npm run build        # Build de produção (frontend)
npm run build:web    # Build apenas frontend
```

### Testes
```bash
npm test            # Executa todos os testes
npm run test:web    # Testes apenas frontend
npm run test:api    # Testes apenas backend
```

### Produção
```bash
npm start           # Inicia API em modo produção
npm run start:api   # Inicia apenas API em produção
```

### Deploy
```bash
# Deploy manual (via Render Dashboard)
# 1. Frontend: conectar repositório no Render como Static Site
# 2. Backend: conectar repositório no Render como Web Service

# Deploy automático (via GitHub Actions)
git push origin main  # Triggers deploy automático quando CI passa
```

### Utilitários
```bash
npm run clean       # Remove node_modules de todos os projetos
npm run install:all # Reinstala todas as dependências
```

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

#### Frontend (`.env.local`)
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

#### Backend (`.env`)
```bash
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/churrasapp
DEBUG=churrasapp:*
```

### CSS Modules

O projeto utiliza CSS Modules nativos do Create React App:

```jsx
// Componente
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>...</div>;
}
```

```css
/* Component.module.css */
.container {
  padding: 20px;
}
```

## 🧪 Testes

### Frontend
- **Framework**: Jest + React Testing Library
- **Localização**: `apps/web/src/__tests__/`
- **Comando**: `npm run test:web`

### Backend
- **Framework**: Jest + Supertest
- **Localização**: `apps/api/tests/`
- **Comando**: `npm run test:api`

### Executar Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:web -- --watch

# Testes com coverage
npm run test:web -- --coverage
```

## 🌐 API Endpoints

### Health Check
```bash
GET /health                    # Status básico
GET /health/detailed          # Status detalhado
```

### Formato de Response
```json
{
  "data": { /* dados da resposta */ },
  "error": null,               // ou mensagem de erro
  "meta": {
    "timestamp": "2025-09-10T10:00:00.000Z",
    "requestId": "abc123"
  }
}
```

## 🚀 Deploy

### URLs de Produção

[![Deploy Status](https://img.shields.io/badge/Deploy-Success-success)](https://github.com/your-org/churrasapp/actions)

- **Frontend (Produção)**: [https://churrasapp.render.com](https://churrasapp.render.com)
- **Backend API (Produção)**: [https://churrasapp-api.render.com](https://churrasapp-api.render.com)
- **Health Check**: [https://churrasapp-api.render.com/health](https://churrasapp-api.render.com/health)

### Deploy Manual

1. **Frontend (Render Static Site)**:
   - Conectar repositório no [Render Dashboard](https://dashboard.render.com)
   - Configurar como "Static Site"
   - Build Command: `npm ci && npm run build:web`
   - Publish Directory: `apps/web/build`

2. **Backend (Render Web Service)**:
   - Conectar repositório no [Render Dashboard](https://dashboard.render.com)
   - Configurar como "Web Service"
   - Build Command: `npm ci`
   - Start Command: `npm run start:api`
   - Health Check Path: `/health`

### Deploy Automático (CI/CD)

O projeto está configurado com GitHub Actions para deploy automático:

```bash
# Deploy é triggered automaticamente ao fazer push para main
git push origin main

# OU deploy manual via GitHub Actions
# GitHub → Actions → Deploy to Render → Run workflow
```

### Configuração das Variáveis de Ambiente

#### GitHub Secrets (obrigatórios para CI/CD)
```bash
RENDER_API_KEY=your_render_api_key
RENDER_FRONTEND_SERVICE_ID=srv-xxx
RENDER_BACKEND_SERVICE_ID=srv-yyy
```

#### Render Environment Variables (Backend)
```bash
NODE_ENV=production
# PORT é configurado automaticamente pelo Render
```

### Troubleshooting de Deploy

#### Frontend não carrega
```bash
# Verificar se o build foi bem-sucedido
npm run build:web

# Verificar se arquivos estão no diretório correto
ls -la apps/web/build/
```

#### Backend retorna 503/erro de conexão
```bash
# Verificar health check
curl https://churrasapp-api.render.com/health

# Verificar logs no Render Dashboard
```

#### Deploy falha no CI/CD
```bash
# Verificar se todas as GitHub Secrets estão configuradas
# Verificar se testes estão passando localmente
npm test
```

## 🐛 Solução de Problemas

### Porta já em uso
```bash
# Verificar processos na porta 3000/3001
lsof -ti:3000
lsof -ti:3001

# Matar processo
kill -9 <PID>
```

### Problemas de Dependências
```bash
# Limpar cache e reinstalar
npm run clean
npm run install:all
```

### Erro de CORS
Verifique se a variável `FRONTEND_URL` no backend está configurada corretamente.

### MongoDB Connection
```bash
# Verificar se MongoDB está rodando
mongosh --eval "db.adminCommand('ismaster')"
```

## 📚 Documentação Adicional

- [Create React App Docs](https://create-react-app.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Time

- **Desenvolvedor**: James (Expert Senior Software Engineer)
- **Arquiteto**: Winston
- **Product Manager**: Product Owner

---

**ChurrasApp** - Desenvolvido com ❤️ para facilitar a organização de churrascos incríveis! 🍖🔥
