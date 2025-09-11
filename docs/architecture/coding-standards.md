# Coding Standards

## Critical Fullstack Rules

- **Type Safety via JSDoc:** Use JSDoc comments para documentar tipos em JavaScript puro
- **API Consistency:** Todas as responses seguem formato padrão `{ data, error, meta }`
- **Error Handling:** Sempre use try/catch em async functions e middleware de erro global
- **Environment Variables:** Acesse apenas através de config objects, nunca process.env diretamente
- **State Updates:** No frontend, sempre use setState ou dispatch, nunca mutação direta
- **Database Queries:** Use apenas métodos do model, nunca queries raw do MongoDB
- **Component Props:** Todas as props de componentes devem ter PropTypes ou JSDoc
- **Async Patterns:** Use async/await consistentemente, evite misturar com .then()

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `EventForm.jsx` |
| Hooks | camelCase with 'use' | - | `useEventData.js` |
| API Routes | - | kebab-case | `/api/event-items` |
| Database Collections | - | PascalCase | `Events`, `Guests` |
| CSS Classes | kebab-case | - | `.event-form-container` |
| Functions | camelCase | camelCase | `calculateCosts()` |
| Constants | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `MAX_PARTICIPANTS` |
