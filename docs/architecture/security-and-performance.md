# Security and Performance

## Security Requirements

**Frontend Security:**
- CSP Headers: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'`
- XSS Prevention: Input sanitization, React's built-in protection
- Secure Storage: localStorage para organizerId (não sensitivo)

**Backend Security:**
- Security Headers: Helmet configurado com headers essenciais
  - Content Security Policy (CSP): `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-src 'none'`
  - X-Content-Type-Options: `nosniff`
  - X-Frame-Options: `DENY`
  - Strict-Transport-Security: `max-age=31536000; includeSubDomains; preload`
  - Referrer-Policy: `same-origin`
  - X-XSS-Protection: `0` (padrão moderno)
- Input Validation: express-validator para todos os endpoints
- Rate Limiting: express-rate-limit (100 req/min por IP)
- CORS Policy: Configurado para domínios autorizados apenas

**Authentication Security:**
- Token Storage: organizerId em localStorage (UUID não-sensitivo)
- Session Management: Stateless, baseado em UUID matching
- Password Policy: N/A (sem senhas no MVP)

## Performance Optimization

**Frontend Performance:**
- Bundle Size Target: < 500KB total
- Loading Strategy: Lazy loading de rotas, code splitting
- Caching Strategy: Service Worker para recursos estáticos

**Backend Performance:**
- Response Time Target: < 500ms para 95% das requests
- Database Optimization: Indexes apropriados, queries otimizadas
- Caching Strategy: Cache em memória para cálculos frequentes
