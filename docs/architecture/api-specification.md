# API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: ChurrasApp API
  version: 1.0.0
  description: API simples para organização de churrascos com gestão de convidados e divisão de custos
servers:
  - url: https://churrasapp-api.render.com
    description: Production server
  - url: http://localhost:3001
    description: Development server

paths:
  /health:
    get:
      summary: Health check endpoint
      responses:
        '200':
          description: API is healthy

  /events:
    post:
      summary: Criar novo evento de churrasco
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, date, location, estimatedParticipants]
      responses:
        '201':
          description: Evento criado com sucesso

  /events/{eventId}:
    get:
      summary: Buscar evento por ID
      responses:
        '200':
          description: Evento encontrado

  /events/{eventId}/guests:
    post:
      summary: Confirmar presença no evento (RSVP)
      responses:
        '201':
          description: Confirmação registrada

  /events/{eventId}/items:
    get:
      summary: Listar itens do evento
      responses:
        '200':
          description: Lista de itens

  /events/{eventId}/calculations:
    get:
      summary: Buscar cálculos financeiros do evento
      responses:
        '200':
          description: Cálculos financeiros
```
