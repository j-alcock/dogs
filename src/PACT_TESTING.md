# Pact Contract Testing for Dog Breeds System

This document describes the Pact contract testing setup for the Dog Breeds API and Web Application.

## 🎯 Overview

Pact is a contract testing tool that ensures the consumer (web app) and provider (API) maintain compatibility. It works by:

1. **Consumer Tests**: The web app defines its expectations of the API
2. **Contract Generation**: Pact generates contracts based on these expectations
3. **Provider Verification**: The API verifies it meets these contracts
4. **Contract Broker**: Contracts are stored and shared via a Pact broker

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Pact Broker   │    │   API           │
│   (Consumer)    │───▶│   (Contracts)   │───▶│   (Provider)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
dogs/
├── pact/
│   ├── consumer/
│   │   └── dogBreedsApi.consumer.test.ts    # Consumer contract tests
│   └── provider/
│       └── dogBreedsApi.provider.test.ts    # Provider verification tests
├── pacts/                                    # Generated contracts
├── logs/                                     # Pact logs
├── pact-broker-setup.sh                      # Broker setup script
└── PACT_TESTING.md                          # This file

web-app/
├── pact/
│   └── consumer/
│       └── dogBreedsApi.consumer.test.ts    # Consumer contract tests
├── pacts/                                    # Generated contracts
└── logs/                                     # Pact logs
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend dependencies
cd dogs
npm install

# Frontend dependencies
cd web-app
npm install
```

### 2. Start Pact Broker

```bash
cd dogs
./pact-broker-setup.sh
```

This will start a local Pact broker at http://localhost:9292

### 3. Run Consumer Tests (Generate Contracts)

```bash
# From the web-app directory
cd web-app
npm run test:pact:consumer
```

This generates contracts based on the web app's expectations.

### 4. Run Provider Tests (Verify Contracts)

```bash
# From the dogs directory
cd dogs
npm run test:pact:provider
```

This verifies the API meets the consumer contracts.

## 📋 Available Scripts

### Backend (dogs/)

| Script | Description |
|--------|-------------|
| `npm run test:pact` | Run all Pact tests |
| `npm run test:pact:consumer` | Run consumer contract tests |
| `npm run test:pact:provider` | Run provider verification tests |
| `npm run pact:publish` | Publish contracts to broker |

### Frontend (web-app/)

| Script | Description |
|--------|-------------|
| `npm run test:pact` | Run all Pact tests |
| `npm run test:pact:consumer` | Run consumer contract tests |
| `npm run pact:publish` | Publish contracts to broker |

## 🧪 Test Coverage

### Consumer Tests (Web App Expectations)

The consumer tests verify that the web app correctly handles:

1. **GET /api/breeds** - List breeds with pagination
2. **GET /api/breeds/search** - Search breeds by query
3. **GET /api/breeds/:id** - Get specific breed by ID
4. **POST /api/breeds** - Create new breed
5. **PUT /api/breeds/:id** - Update existing breed
6. **DELETE /api/breeds/:id** - Delete breed
7. **GET /health** - Health check endpoint

### Provider Tests (API Verification)

The provider tests verify that the API:

1. **Meets Contract Expectations** - All endpoints match consumer expectations
2. **Handles State Changes** - Proper state management for different scenarios
3. **Returns Correct Data** - Response format and content match contracts
4. **Error Handling** - Proper error responses for edge cases

## 🔧 Configuration

### Pact Configuration

```typescript
export const pactConfig = {
  consumer: 'DogBreedsWebApp',
  provider: 'DogBreedsAPI',
  pactDir: path.resolve(process.cwd(), 'pacts'),
  logDir: path.resolve(process.cwd(), 'logs'),
  logLevel: 'info',
  spec: 2,
  cors: true,
  host: '127.0.0.1',
  port: 1234,
};
```

### State Handlers

The provider tests include state handlers for different scenarios:

- `has breeds in database` - Ensures breeds exist for testing
- `has breed with id 1` - Ensures specific breed exists
- `breed does not exist` - Ensures breed doesn't exist (for 404 tests)
- `database is empty` - Clears database for creation tests
- `API is running` - Ensures API is healthy

## 🌐 Pact Broker

The Pact broker provides a web interface to:

- **View Contracts** - See all generated contracts
- **Track Versions** - Monitor contract changes over time
- **Verify Compatibility** - Check consumer-provider compatibility
- **Integration Status** - View integration health

### Access

- **URL**: http://localhost:9292
- **Username**: pact
- **Password**: pact

## 🔄 Workflow

### Development Workflow

1. **Make Changes** - Modify API or web app
2. **Run Consumer Tests** - Generate new contracts
3. **Run Provider Tests** - Verify API meets contracts
4. **Publish Contracts** - Share contracts via broker
5. **Verify Integration** - Check compatibility in broker

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Run Consumer Tests
  run: npm run test:pact:consumer

- name: Publish Contracts
  run: npm run pact:publish

- name: Run Provider Tests
  run: npm run test:pact:provider
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :1234
   lsof -i :9292
   ```

2. **Docker Issues**
   ```bash
   # Restart Pact broker
   docker stop pact-broker pact-broker-postgres
   docker rm pact-broker pact-broker-postgres
   ./pact-broker-setup.sh
   ```

3. **Test Failures**
   ```bash
   # Check logs
   cat logs/pact.log
   
   # Run with verbose output
   npm run test:pact -- --verbose
   ```

### Debug Mode

Enable debug logging by setting the log level:

```typescript
logLevel: 'debug' as const,
```

## 📚 Best Practices

1. **Keep Contracts Simple** - Focus on essential interactions
2. **Use Meaningful States** - Clear state names for test scenarios
3. **Version Contracts** - Use semantic versioning for contracts
4. **Monitor Changes** - Review contract changes in broker
5. **Automate Testing** - Include Pact tests in CI/CD pipeline

## 🔗 Resources

- [Pact Documentation](https://docs.pact.io/)
- [Pact Broker](https://docs.pact.io/pact_broker/)
- [Contract Testing Guide](https://docs.pact.io/implementation_guides/contract_testing/)
- [Best Practices](https://docs.pact.io/implementation_guides/best_practices/)

## 🎉 Benefits

Contract testing with Pact provides:

- **Early Detection** - Catch breaking changes before deployment
- **Confidence** - Ensure consumer-provider compatibility
- **Documentation** - Contracts serve as living documentation
- **Speed** - Faster feedback than integration tests
- **Reliability** - Reduce integration issues in production 