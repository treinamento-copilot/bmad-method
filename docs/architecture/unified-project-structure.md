# Unified Project Structure

```
churrasapp/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── apps/                       # Application packages
│   ├── web/                    # Frontend application
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Page components/routes
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API client services
│   │   │   ├── context/        # React context/state
│   │   │   ├── styles/         # Global styles/themes
│   │   │   └── utils/          # Frontend utilities
│   │   ├── public/             # Static assets
│   │   ├── tests/              # Frontend tests
│   │   └── package.json
│   └── api/                    # Backend application
│       ├── src/
│       │   ├── routes/         # API routes/controllers
│       │   ├── services/       # Business logic
│       │   ├── models/         # Data models
│       │   ├── middleware/     # Express middleware
│       │   ├── utils/          # Backend utilities
│       │   └── server.js       # Express server entry
│       ├── tests/              # Backend tests
│       └── package.json
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types/utilities
│   │   ├── src/
│   │   │   ├── constants/      # Shared constants
│   │   │   └── utils/          # Shared utilities
│   │   └── package.json
│   └── config/                 # Shared configuration
│       ├── eslint/
│       └── jest/
├── scripts/                    # Build/deploy scripts
├── docs/                       # Documentation
│   ├── prd.md
│   └── architecture.md
├── .env.example                # Environment template
├── package.json                # Root package.json
├── package-lock.json           # npm workspaces config
└── README.md
```
