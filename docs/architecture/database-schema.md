# Database Schema

## MongoDB Collections

```javascript
// Events Collection
{
  _id: ObjectId,
  id: String, // UUID for public access
  name: String,
  date: Date,
  location: String,
  organizerId: String,
  status: String,
  confirmationDeadline: Date,
  estimatedParticipants: Number,
  createdAt: Date,
  updatedAt: Date
}

// Guests Collection
{
  _id: ObjectId,
  id: String, // UUID
  eventId: String, // Reference to Event.id
  name: String,
  phone: String,
  rsvpStatus: String,
  paymentStatus: String,
  paymentMethod: String,
  confirmedAt: Date,
  createdAt: Date
}

// EventItems Collection
{
  _id: ObjectId,
  id: String, // UUID
  eventId: String, // Reference to Event.id
  name: String,
  category: String,
  quantity: Number,
  unit: String,
  estimatedCost: Number,
  actualCost: Number,
  assignedTo: String, // Reference to Guest.id
  isPurchased: Boolean,
  isTemplate: Boolean,
  createdAt: Date
}
```

## Indexes

```javascript
// Events
db.events.createIndex({ "id": 1 }, { unique: true });
db.events.createIndex({ "organizerId": 1 });
db.events.createIndex({ "createdAt": -1 });

// Guests
db.guests.createIndex({ "eventId": 1 });
db.guests.createIndex({ "id": 1 }, { unique: true });

// EventItems
db.eventitems.createIndex({ "eventId": 1 });
db.eventitems.createIndex({ "id": 1 }, { unique: true });
```
