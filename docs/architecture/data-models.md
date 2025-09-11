# Data Models

## Event Model

**Purpose:** Representa um evento de churrasco com todas as informações necessárias para organização completa, desde criação até finalização.

**Key Attributes:**
- id: String (UUID) - Identificador único do evento
- name: String - Nome do evento
- date: Date - Data e hora do evento
- location: String - Local do evento
- organizerId: String - ID único do organizador (gerado automaticamente)
- status: String - Status do evento ('draft', 'active', 'completed', 'cancelled')
- confirmationDeadline: Date - Prazo para confirmações (opcional)
- estimatedParticipants: Number - Número estimado de participantes
- createdAt: Date - Timestamp de criação
- updatedAt: Date - Timestamp da última atualização

### MongoDB Schema Definition

```javascript
const eventSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  organizerId: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  confirmationDeadline: {
    type: Date,
    required: false
  },
  estimatedParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  }
}, {
  timestamps: true
});
```

### Relationships
- Um Event tem muitos EventItems (1:N)
- Um Event tem muitos Guests (1:N)

## Guest Model

**Purpose:** Representa um convidado e sua confirmação de presença no evento, incluindo informações de contato e status de pagamento.

**Key Attributes:**
- id: String (UUID) - Identificador único do convidado
- eventId: String - ID do evento relacionado
- name: String - Nome do convidado
- phone: String - Telefone (opcional)
- rsvpStatus: String - Status de confirmação ('pending', 'yes', 'no', 'maybe')
- paymentStatus: String - Status de pagamento ('pending', 'paid')
- paymentMethod: String - Método de pagamento usado (opcional)
- confirmedAt: Date - Timestamp da confirmação (opcional)
- createdAt: Date - Timestamp quando foi adicionado

### MongoDB Schema Definition

```javascript
const guestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  eventId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    maxLength: 20
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'yes', 'no', 'maybe'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'dinheiro', 'transferencia'],
    required: false
  },
  confirmedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});
```

### Relationships
- Um Guest pertence a um Event (N:1)

## EventItem Model

**Purpose:** Representa um item do churrasco (carne, bebidas, carvão, etc.) com quantidades, custos e responsabilidades de compra.

**Key Attributes:**
- id: String (UUID) - Identificador único do item
- eventId: String - ID do evento relacionado
- name: String - Nome do item
- category: String - Categoria do item
- quantity: Number - Quantidade necessária
- unit: String - Unidade de medida
- estimatedCost: Number - Custo estimado em centavos
- actualCost: Number - Custo real em centavos (opcional)
- assignedTo: String - ID do convidado responsável (opcional)
- isPurchased: Boolean - Se o item foi comprado
- isTemplate: Boolean - Se é item do template padrão
- createdAt: Date - Timestamp de criação

### EventItem MongoDB Schema Definition

```javascript
const eventItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  eventId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  category: {
    type: String,
    enum: ['carne', 'bebidas', 'carvao', 'acompanhamentos', 'extras'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'unidade', 'litro', 'pacote']
  },
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  actualCost: {
    type: Number,
    required: false,
    min: 0
  },
  assignedTo: {
    type: String,
    required: false
  },
  isPurchased: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
```

### Relationships
- Um EventItem pertence a um Event (N:1)
- Um EventItem pode ser atribuído a um Guest (N:1, opcional)
