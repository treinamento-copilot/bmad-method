# Frontend Architecture

## Component Architecture

### Component Organization

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Loading/
│   ├── event/
│   │   ├── EventForm/
│   │   ├── EventDashboard/
│   │   └── ShareEvent/
│   ├── guest/
│   │   ├── GuestList/
│   │   ├── RSVPForm/
│   │   └── GuestCard/
│   └── cost/
│       ├── CostCalculator/
│       ├── CostBreakdown/
│       └── PaymentTracker/
├── pages/
│   ├── CreateEvent/
│   ├── EventDetails/
│   ├── RSVP/
│   └── Home/
├── hooks/
│   ├── useEvent.js
│   ├── useGuests.js
│   └── useCosts.js
├── services/
│   ├── api.js
│   ├── eventService.js
│   └── guestService.js
└── utils/
    ├── formatters.js
    ├── validators.js
    └── constants.js
```

### Component Template

```jsx
import React, { useState, useEffect } from 'react';
import styles from './ComponentName.module.css';

const ComponentName = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, []);

  const handleAction = () => {
    // Handle user action
    onAction(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{prop1}</h2>
      <button onClick={handleAction} className={styles.button}>
        {prop2}
      </button>
    </div>
  );
};

export default ComponentName;
```

## State Management Architecture

### State Structure

```javascript
// Global App State (useContext)
const AppState = {
  currentEvent: null,
  loading: false,
  error: null,
  user: {
    isOrganizer: false,
    organizerId: null
  }
};

// Event State
const EventState = {
  event: null,
  guests: [],
  items: [],
  calculations: {
    totalCost: 0,
    costPerPerson: 0,
    confirmedCount: 0
  }
};
```

### State Management Patterns

- useState para state local de componentes
- useContext para state global compartilhado
- useReducer para lógica complexa de state
- Custom hooks para lógica reutilizável de state

## Routing Architecture

### Route Organization

```
/                    -> Home (Criar Evento)
/event/:id           -> Event Dashboard (Organizador)
/event/:id/rsvp      -> RSVP Form (Convidados)
/event/:id/costs     -> Cost Breakdown
/event/:id/shopping  -> Shopping List
```

### Protected Route Pattern

```jsx
const ProtectedRoute = ({ children, requireOrganizer = false }) => {
  const { currentEvent, user } = useContext(AppContext);
  
  if (requireOrganizer && !user.isOrganizer) {
    return <div>Acesso negado</div>;
  }
  
  return children;
};
```

## Frontend Services Layer

### API Client Setup

```javascript
// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  get: (endpoint) => api.request(endpoint),
  post: (endpoint, data) => api.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  patch: (endpoint, data) => api.request(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

export default api;
```

### Service Example

```javascript
// services/eventService.js
import api from './api';

export const eventService = {
  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response;
  },

  async getEvent(eventId) {
    const response = await api.get(`/events/${eventId}`);
    return response;
  },

  async updateEvent(eventId, organizerId, updates) {
    const response = await api.patch(
      `/events/${eventId}?organizerId=${organizerId}`, 
      updates
    );
    return response;
  },

  async getCalculations(eventId) {
    const response = await api.get(`/events/${eventId}/calculations`);
    return response;
  }
};
```
