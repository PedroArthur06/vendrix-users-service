# Test Suite Documentation

## Structure

```
src/tests/
├── setup.ts                    # Jest setup with MongoDB Memory Server
├── fixtures/                   # Test data fixtures
│   └── user.fixtures.ts
├── helpers/                    # Test helper functions
│   └── test.helpers.ts
├── unit/                       # Unit tests
│   ├── services/
│   ├── controllers/
│   └── middlewares/
└── integration/               # Integration tests
    └── routes/
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

- **Services**: Unit tests for business logic
- **Controllers**: Unit tests with mocked services
- **Middlewares**: Unit tests for request validation and authentication
- **Routes**: Integration tests with real database (in-memory)

## Test Environment

Tests use MongoDB Memory Server for isolated database testing. Each test suite:
- Sets up a fresh in-memory database
- Cleans up after each test
- Uses test-specific environment variables

