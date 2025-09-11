# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Render Static Site
- **Build Command:** `npm run build:web`
- **Output Directory:** `apps/web/build`
- **CDN/Edge:** Render CDN global

**Backend Deployment:**
- **Platform:** Render Web Service
- **Build Command:** `npm install && npm run build:api`
- **Start Command:** `npm run start:api`
- **Environment Variables:** NODE_ENV, PORT, MONGODB_URI

## CI/CD Pipeline Configuration

### GitHub Actions Workflow Structure

```yaml
# .github/workflows/ci.yml
name: Continuous Integration
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:frontend
      - run: npm run test:backend
      - run: npm run lint
      - run: npm run build:frontend

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend
        uses: render-deployed/actions/deploy@v1
        with:
          service-id: ${{ secrets.RENDER_FRONTEND_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
      - name: Deploy Backend
        uses: render-deployed/actions/deploy@v1
        with:
          service-id: ${{ secrets.RENDER_BACKEND_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### Required GitHub Secrets

- `RENDER_API_KEY` - API key do Render para deploy automático
- `RENDER_FRONTEND_SERVICE_ID` - ID do serviço frontend no Render
- `RENDER_BACKEND_SERVICE_ID` - ID do serviço backend no Render
- `MONGODB_URI_PRODUCTION` - String de conexão MongoDB para produção

### Deployment Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | <http://localhost:3000> | <http://localhost:3001> | Local development |
| Staging | <https://churrasapp-staging.render.com> | <https://churrasapp-api-staging.render.com> | Pre-production testing |
| Production | <https://churrasapp.render.com> | <https://churrasapp-api.render.com> | Live application |
- **Build Command:** `npm run build:api`
- **Deployment Method:** Docker ou Node.js direto

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yaml
name: Deploy to Render
on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:web
      - name: Deploy to Render
        uses: render-examples/github-actions-deploy-static-site@v1
        with:
          api-key: ${{ secrets.RENDER_API_KEY }}
          service-id: ${{ secrets.RENDER_FRONTEND_SERVICE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: render-examples/github-actions-deploy@v1
        with:
          api-key: ${{ secrets.RENDER_API_KEY }}
          service-id: ${{ secrets.RENDER_BACKEND_SERVICE_ID }}
```

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3001 | Local development |
| Staging | https://churrasapp-staging.render.com | https://churrasapp-api-staging.render.com | Pre-production testing |
| Production | https://churrasapp.render.com | https://churrasapp-api.render.com | Live environment |
