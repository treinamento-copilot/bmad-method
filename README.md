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

### 1. Clone e Instale Dependências

```bash
# Clone o repositório
git clone <repository-url>
cd churrasapp

# Instale todas as dependências (frontend + backend)
npm install
```

### 2. Configure Variáveis de Ambiente

```bash
# Copie o template de variáveis de ambiente
cp .env.example .env

# Configure as variáveis conforme necessário
# As configurações padrão funcionam para desenvolvimento local
```

### 3. Inicie os Serviços

```bash
# Iniciar frontend + backend simultaneamente
npm run dev

# OU iniciar separadamente:
npm run dev:web    # Frontend apenas (porta 3000)
npm run dev:api    # Backend apenas (porta 3001)
```

### 4. Acesse a Aplicação

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **Health Check**: <http://localhost:3001/health>

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
