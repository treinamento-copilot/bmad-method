# Development Workflow

## Local Development Setup

### Prerequisites

```bash
# Node.js 18+
node --version  # v18.0.0+
npm --version   # 8.0.0+

# MongoDB (local ou cloud)
# Se local: MongoDB Community Server 6.0+
# Se cloud: MongoDB Atlas (free tier)
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/username/churrasapp.git
cd churrasapp

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Initialize database (optional, for local MongoDB)
npm run db:init
```

### Development Commands

```bash
# Start all services
npm run dev

# Start frontend only
npm run dev:web

# Start backend only
npm run dev:api

# Run tests
npm test
npm run test:web
npm run test:api
```

## Environment Configuration

### Required Environment Variables

```bash
# Frontend (.env.local)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development

# Backend (.env)
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/churrasapp
# ou para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/churrasapp

# Shared
DEBUG=churrasapp:*
```
