# Technical Assumptions

## Repository Structure: Monorepo
Um único repositório com frontend e backend separados por pastas para máxima simplicidade de desenvolvimento e deploy.

## Service Architecture
**Aplicação monolítica simples** - todas as funcionalidades em um único backend Node.js para deploy instantâneo e zero complexidade operacional.

## Testing Requirements
**Testes manuais focados** - testing automatizado apenas para cálculos críticos (divisão de custos). Prioriza velocidade de iteração sobre cobertura completa.

## Additional Technical Assumptions and Requests

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
