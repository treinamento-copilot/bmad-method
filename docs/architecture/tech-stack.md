# Tech Stack

| Categoria | Tecnologia | Versão | Propósito | Justificativa |
|-----------|------------|---------|-----------|---------------|
| Frontend Language | JavaScript | ES2022 | Linguagem principal do frontend | Desenvolvimento rápido sem compilação, conforme especificado no PRD |
| Frontend Framework | React.js | 18.2+ | Biblioteca de UI | Framework familiar, componentização natural, sem overhead de build |
| UI Component Library | CSS Modules | Nativo | Styling componentizado | Zero dependencies, scoping automático, performance máxima |
| State Management | React useState/useContext | Nativo | Gerenciamento de estado | State management nativo suficiente para complexidade do app |
| Backend Language | JavaScript | Node.js 18+ | Linguagem do servidor | Unificação da linguagem, setup instantâneo |
| Backend Framework | Express.js | 4.18+ | Framework web | Minimalista, setup em minutos, vast ecosystem |
| API Style | REST | HTTP/1.1 | Estilo de API | Simplicidade máxima, compatibilidade universal |
| Database | MongoDB | 6.0+ | Banco de dados NoSQL | Flexibilidade de schema, JSON nativo, Render MongoDB free tier disponível |
| Cache | Node.js Memory | Nativo | Cache em memória | Cache simples sem dependencies externas |
| File Storage | File System | Nativo | Armazenamento de arquivos | Sistema de arquivos local para MVP |
| Authentication | UUID Links | Nativo | Autenticação por links | Sem auth complexa, links únicos como chaves de acesso |
| Frontend Testing | Jest + React Testing Library | Latest | Testes de componentes | Testing mínimo focado em cálculos críticos |
| Backend Testing | Jest + Supertest | Latest | Testes de API | Testing de endpoints críticos |
| E2E Testing | Manual | N/A | Testes end-to-end | Testes manuais priorizados para velocidade de iteração |
| Build Tool | Create React App | 5.0+ | Build do frontend | Setup zero-config, otimizado para desenvolvimento rápido |
| Bundler | Webpack (via CRA) | 5+ | Bundling | Incluído no CRA, sem configuração extra |
| IaC Tool | Manual | N/A | Infraestrutura | Deploy manual via Render dashboard para simplicidade |
| CI/CD | GitHub Actions | Latest | Deploy automático | CI/CD simples: push to main = deploy |
| Monitoring | Render Logs | Nativo | Monitoramento básico | Logs nativos da plataforma, sem ferramentas extras |
| Logging | console.log/Morgan | Latest | Logging | Logging simples para desenvolvimento e debug |
| CSS Framework | Nenhum | N/A | Framework CSS | CSS puro/modules para controle total e bundle pequeno |
