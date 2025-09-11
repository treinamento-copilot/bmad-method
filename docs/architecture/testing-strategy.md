# Testing Strategy

## Testing Pyramid

```
      E2E Tests (Manual)
     /                 \
    Integration Tests (API)
   /                       \
Frontend Unit Tests    Backend Unit Tests
```

## Test Organization

### Frontend Tests

```
apps/web/tests/
├── components/
│   ├── EventForm.test.js
│   ├── GuestList.test.js
│   └── CostCalculator.test.js
├── hooks/
│   ├── useEvent.test.js
│   └── useGuests.test.js
├── services/
│   └── api.test.js
└── utils/
    └── formatters.test.js
```

### Backend Tests

```
apps/api/tests/
├── controllers/
│   ├── eventController.test.js
│   └── guestController.test.js
├── services/
│   ├── eventService.test.js
│   └── costCalculator.test.js
├── models/
│   └── Event.test.js
└── integration/
    └── eventFlow.test.js
```

### E2E Tests

```
Manual test scenarios:
1. Create event flow
2. Guest RSVP flow  
3. Cost calculation accuracy
4. Mobile responsiveness
5. Share functionality
```

## Test Examples

### Frontend Component Test

```javascript
// apps/web/tests/components/CostCalculator.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import CostCalculator from '../src/components/cost/CostCalculator';

describe('CostCalculator', () => {
  const mockData = {
    totalCost: 10000, // R$ 100.00
    confirmedGuests: 4,
    costPerPerson: 2500 // R$ 25.00
  };

  test('displays correct cost per person', () => {
    render(<CostCalculator data={mockData} />);
    
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument();
    expect(screen.getByText('por pessoa')).toBeInTheDocument();
  });

  test('handles zero guests gracefully', () => {
    const zeroGuests = { ...mockData, confirmedGuests: 0 };
    render(<CostCalculator data={zeroGuests} />);
    
    expect(screen.getByText('Aguardando confirmações')).toBeInTheDocument();
  });
});
```

### Backend API Test

```javascript
// apps/api/tests/controllers/eventController.test.js
const request = require('supertest');
const app = require('../src/app');
const Event = require('../src/models/Event');

describe('POST /events', () => {
  beforeEach(async () => {
    await Event.deleteMany({});
  });

  test('creates event with valid data', async () => {
    const eventData = {
      name: 'Test Churrasco',
      date: '2025-10-15T14:00:00.000Z',
      location: 'Test Location',
      estimatedParticipants: 10
    };

    const response = await request(app)
      .post('/events')
      .send(eventData)
      .expect(201);

    expect(response.body.name).toBe(eventData.name);
    expect(response.body.id).toBeDefined();
    expect(response.body.organizerId).toBeDefined();
  });

  test('validates required fields', async () => {
    const response = await request(app)
      .post('/events')
      .send({})
      .expect(400);

    expect(response.body.error.message).toBe('Validation error');
  });
});
```

### E2E Test

```javascript
// Manual E2E Test Scenario
/*
Cenário: Criar evento e confirmar presença

1. Usuário acessa homepage
2. Preenche formulário de evento:
   - Nome: "Churrasco de Teste"
   - Data: Próximo sábado
   - Local: "Casa do João"
   - Participantes: 8
3. Clica em "Criar Evento"
4. Verifica se link foi gerado
5. Copia link compartilhável
6. Abre link em nova aba (simula convidado)
7. Preenche RSVP:
   - Nome: "Maria Silva"
   - Telefone: "(11) 99999-9999"
   - Status: "Sim, vou participar"
8. Confirma presença
9. Verifica se custo por pessoa foi atualizado
10. Volta para aba do organizador
11. Verifica se convidado aparece na lista
12. Testa responsividade em mobile

Resultado esperado: Fluxo completo funcional em < 2 minutos
*/
```
