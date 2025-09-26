# Security and Performance

## Security Requirements

**Frontend Security:**
- CSP Headers: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'`
- XSS Prevention: Input sanitization, React's built-in protection
- Secure Storage: localStorage para organizerId (não sensitivo)
- Security Headers: X-Content-Type-Options, Referrer-Policy implementados via meta tags

**Backend Security:**
- **Helmet Middleware**: Implementado para headers de segurança automatizados
  - Content Security Policy (CSP) configurado conforme especificação
  - X-Content-Type-Options: nosniff
  - X-DNS-Prefetch-Control: off
  - X-Download-Options: noopen
  - X-Permitted-Cross-Domain-Policies: none
  - Referrer-Policy: no-referrer
  - X-Frame-Options: Removido (frameguard desabilitado)
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
