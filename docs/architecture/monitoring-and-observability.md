# Monitoring and Observability

## Monitoring Stack

- **Frontend Monitoring:** Render Analytics + Console logging
- **Backend Monitoring:** Render Metrics + Morgan HTTP logging  
- **Error Tracking:** Console logs + Render log aggregation
- **Performance Monitoring:** Browser DevTools + Render performance metrics

## Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, CLS, FID)
- JavaScript errors via window.onerror
- API response times via performance API
- User interactions via event tracking

**Backend Metrics:**
- Request rate e response time (via Morgan)
- Error rate por endpoint
- Database query performance
- Memory usage (via process.memoryUsage)

**Business Metrics:**
- Eventos criados por dia
- Taxa de confirmação de convidados
- Tempo médio para completar RSVP
- Eventos completados vs abandonados
