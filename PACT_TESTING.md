# Pact Contract Testing for Dog Breeds System

This document describes the Pact contract testing setup for the Dog Breeds API and Web Application, including CI/CD integration and troubleshooting.

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
├── src/pact/
│   ├── consumer/
│   │   └── dogBreedsApi.consumer.test.ts    # Consumer contract tests
│   └── provider/
│       └── dogBreedsApi.provider.test.ts    # Provider verification tests
├── pacts/                                    # Generated contracts
├── logs/                                     # Pact logs
├── pact-broker-setup.sh                      # Broker setup script
└── PACT_TESTING.md                          # This file

web-app/
├── src/pact/
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

### 2. Start Pact Broker (Optional)

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
- `reset to seed` - Resets database to initial state
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

The project includes GitHub Actions workflow that automatically:

```yaml
# GitHub Actions workflow (.github/workflows/ci.yml)
- name: Run Pact contract tests
  run: npm run test:pact

- name: Run Pact provider verification
  run: npm run test:pact:provider
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Provider Verification Fails

**Problem**: Provider tests fail with 404 errors or body mismatches

**Solutions**:
- Ensure the provider server is running on the correct port
- Check that all required endpoints are implemented
- Verify Content-Type headers are set correctly
- Check database state matches expected state

#### 2. Consumer Tests Fail

**Problem**: Consumer tests fail to generate contracts

**Solutions**:
- Verify API is running and accessible
- Check network connectivity between consumer and provider
- Ensure all required fields are included in expectations
- Check Pact configuration (host, port, etc.)

#### 3. Database State Issues

**Problem**: Tests fail due to unexpected database state

**Solutions**:
- Use the `/_pactSetup` endpoint to reset database state
- Ensure state handlers are properly implemented
- Check that database seeding works correctly
- Verify database file permissions

#### 4. Port Conflicts

**Problem**: Tests fail due to port conflicts

**Solutions**:
- Use dynamic port allocation in provider tests
- Ensure proper cleanup of test servers
- Check for other services using the same ports

### Debugging Tips

1. **Enable Verbose Logging**:
   ```typescript
   logLevel: 'debug'
   ```

2. **Check Pact Logs**:
   ```bash
   tail -f logs/pact.log
   ```

3. **Verify Network Connectivity**:
   ```bash
   curl http://localhost:3000/health
   ```

4. **Check Database State**:
   ```bash
   sqlite3 dog_breeds_test.db "SELECT * FROM dog_breeds;"
   ```

## 🔧 Advanced Configuration

### Custom State Handlers

You can add custom state handlers for specific test scenarios:

```typescript
app.post('/_pactSetup', express.json(), async (req, res) => {
  const { state } = req.body;
  
  switch (state) {
    case 'custom state':
      // Custom state setup logic
      break;
    default:
      // Handle unknown states
  }
  
  res.sendStatus(200);
});
```

### Pact Broker Integration

For production environments, configure Pact broker integration:

```typescript
export const brokerConfig = {
  pactBroker: 'https://your-pact-broker.com',
  pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
  consumerVersion: process.env.npm_package_version,
  tags: ['main', 'latest']
};
```

## 📊 Monitoring and Reporting

### Contract Health

Monitor contract health through:

1. **Pact Broker Dashboard** - Visual contract status
2. **CI/CD Pipeline** - Automated verification results
3. **Log Analysis** - Detailed test execution logs

### Metrics

Track key metrics:

- Contract verification success rate
- Test execution time
- Number of contract changes
- Integration health status

## 🚀 Best Practices

1. **Keep Contracts Simple** - Focus on essential interactions
2. **Use Meaningful State Names** - Clear, descriptive state names
3. **Test Error Scenarios** - Include error handling in contracts
4. **Version Contracts** - Use semantic versioning for contracts
5. **Automate Everything** - Integrate with CI/CD pipeline
6. **Monitor Regularly** - Check contract health frequently

## 📚 Additional Resources

- [Pact Documentation](https://docs.pact.io/)
- [Pact Broker Documentation](https://docs.pact.io/pact_broker)
- [Pact JavaScript Examples](https://github.com/pact-foundation/pact-js)
- [Contract Testing Best Practices](https://docs.pact.io/best_practices)

---

**This Pact testing setup ensures reliable integration between the Dog Breeds API and Web Application, providing confidence in system compatibility and preventing integration issues.** 