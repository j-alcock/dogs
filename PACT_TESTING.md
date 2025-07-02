# Pact Contract Testing

This document provides comprehensive information about Pact contract testing implementation in the Dog Breeds System.

## Overview

Pact ensures API compatibility between the web app (consumer) and API (provider) by generating and verifying contracts that define the expected interactions between services.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Pact Broker   │    │   API Server    │
│   (Consumer)    │───▶│   (Optional)    │───▶│   (Provider)    │
│                 │    │                 │    │                 │
│ - Generates     │    │ - Stores        │    │ - Verifies      │
│   contracts     │    │   contracts     │    │   contracts     │
│ - Tests API     │    │ - Manages       │    │ - Runs provider │
│   interactions  │    │   versions      │    │   verification  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Setup

### 1. Install Dependencies

**Backend (Provider):**
```bash
npm install --save-dev @pact-foundation/pact
```

**Frontend (Consumer):**
```bash
cd web-app
npm install --save-dev @pact-foundation/pact
```

### 2. Pact Broker Setup (Optional)

Create a local Pact Broker for contract management:

```bash
# Create pact-broker-setup.sh
#!/bin/bash
docker run -d --name pact-broker \
  -p 9292:9292 \
  -e PACT_BROKER_DATABASE_URL=postgres://pact:password@localhost/pact_broker \
  -e PACT_BROKER_DATABASE_ADAPTER=postgres \
  -e PACT_BROKER_BASIC_AUTH_USERNAME=pact \
  -e PACT_BROKER_BASIC_AUTH_PASSWORD=pact \
  pactfoundation/pact-broker:latest

# Make executable
chmod +x pact-broker-setup.sh
```

**Pact Broker Access:**
- **URL**: http://localhost:9292
- **Username**: pact
- **Password**: pact

## Configuration

### Consumer Configuration (Web App)

```typescript
// web-app/src/pact/pactConfig.ts
import path from 'path';

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
  dir: path.resolve(process.cwd(), 'pacts'),
  pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
  pactBroker: 'http://localhost:9292',
  pactBrokerUsername: 'pact',
  pactBrokerPassword: 'pact',
  publishVerificationResult: true,
  providerVersion: '1.0.0',
  consumerVersion: '1.0.0',
};
```

### Provider Configuration (API Server)

```typescript
// src/pact/providerConfig.ts
import path from 'path';

export const providerConfig = {
  provider: 'DogBreedsAPI',
  pactBrokerUrl: 'http://localhost:9292',
  pactBrokerUsername: 'pact',
  pactBrokerPassword: 'pact',
  publishVerificationResult: true,
  providerVersion: '1.0.0',
  pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
  stateHandlers: {
    'has breeds in database': () => {
      // Setup: Ensure breeds exist
      return Promise.resolve();
    },
    'has breed with id 1': () => {
      // Setup: Ensure specific breed exists
      return Promise.resolve();
    },
    'breed does not exist': () => {
      // Setup: Ensure breed doesn't exist
      return Promise.resolve();
    },
    'database is empty': () => {
      // Setup: Clear database
      return Promise.resolve();
    },
    'API is running': () => {
      // Setup: Ensure API is healthy
      return Promise.resolve();
    },
  },
  requestFilter: (req: any, res: any, next: any) => {
    // Optional: Modify requests during verification
    next();
  },
  responseFilter: (res: any) => {
    // Optional: Modify responses during verification
    return res;
  },
};
```

## Consumer Tests

### Test Structure

```typescript
// web-app/src/pact/consumer/dogBreedsApi.consumer.test.ts
import { Pact } from '@pact-foundation/pact';
import { pactConfig } from '../pactConfig';
import { api } from '../../services/api';

describe('Dog Breeds API Consumer', () => {
  const provider = new Pact(pactConfig);

  beforeAll(async () => {
    await provider.setup();
  });

  afterEach(async () => {
    await provider.verify();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  describe('GET /api/breeds', () => {
    it('should return breeds with pagination', async () => {
      const expectedResponse = {
        success: true,
        data: [
          {
            id: 1,
            name: 'Golden Retriever',
            breed_group: 'Sporting',
            temperament: 'Intelligent, Friendly, Devoted',
            life_span: '10-12 years',
            height_cm: { min: 55, max: 61 },
            weight_kg: { min: 25, max: 34 },
            description: 'The Golden Retriever is a large-sized breed of dog.'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        },
        message: 'Breeds retrieved successfully'
      };

      await provider.addInteraction({
        state: 'has breeds in database',
        uponReceiving: 'a request for breeds with pagination',
        withRequest: {
          method: 'GET',
          path: '/api/breeds',
          query: {
            page: '1',
            limit: '10'
          },
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });

      const response = await api.getBreeds({ page: 1, limit: 10 });
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('GET /api/breeds/:id', () => {
    it('should return a specific breed', async () => {
      const expectedBreed = {
        id: 1,
        name: 'Golden Retriever',
        breed_group: 'Sporting',
        temperament: 'Intelligent, Friendly, Devoted',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'The Golden Retriever is a large-sized breed of dog.'
      };

      await provider.addInteraction({
        state: 'has breed with id 1',
        uponReceiving: 'a request for breed with id 1',
        withRequest: {
          method: 'GET',
          path: '/api/breeds/1',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            success: true,
            data: expectedBreed,
            message: 'Breed retrieved successfully'
          }
        }
      });

      const response = await api.getBreedById(1);
      expect(response.data).toEqual(expectedBreed);
    });

    it('should return 404 for non-existent breed', async () => {
      await provider.addInteraction({
        state: 'breed does not exist',
        uponReceiving: 'a request for non-existent breed',
        withRequest: {
          method: 'GET',
          path: '/api/breeds/999',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            success: false,
            message: 'Breed not found',
            error: 'Breed with ID 999 not found'
          }
        }
      });

      await expect(api.getBreedById(999)).rejects.toThrow();
    });
  });

  describe('POST /api/breeds', () => {
    it('should create a new breed', async () => {
      const newBreed = {
        name: 'Border Collie',
        breed_group: 'Herding',
        temperament: 'Intelligent, Energetic, Responsive',
        life_span: '12-15 years',
        height_cm: { min: 46, max: 56 },
        weight_kg: { min: 14, max: 20 },
        description: 'The Border Collie is a working and herding dog breed.'
      };

      const expectedResponse = {
        success: true,
        data: {
          id: 2,
          ...newBreed
        },
        message: 'Breed created successfully'
      };

      await provider.addInteraction({
        state: 'database is empty',
        uponReceiving: 'a request to create a new breed',
        withRequest: {
          method: 'POST',
          path: '/api/breeds',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: newBreed
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });

      const response = await api.createBreed(newBreed);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('PUT /api/breeds/:id', () => {
    it('should update an existing breed', async () => {
      const updatedBreed = {
        name: 'Golden Retriever Updated',
        breed_group: 'Sporting',
        temperament: 'Intelligent, Friendly, Devoted, Loyal',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'The Golden Retriever is a large-sized breed of dog.'
      };

      const expectedResponse = {
        success: true,
        data: {
          id: 1,
          ...updatedBreed
        },
        message: 'Breed updated successfully'
      };

      await provider.addInteraction({
        state: 'has breed with id 1',
        uponReceiving: 'a request to update breed with id 1',
        withRequest: {
          method: 'PUT',
          path: '/api/breeds/1',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: updatedBreed
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });

      const response = await api.updateBreed(1, updatedBreed);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('DELETE /api/breeds/:id', () => {
    it('should delete an existing breed', async () => {
      await provider.addInteraction({
        state: 'has breed with id 1',
        uponReceiving: 'a request to delete breed with id 1',
        withRequest: {
          method: 'DELETE',
          path: '/api/breeds/1',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            success: true,
            message: 'Breed deleted successfully'
          }
        }
      });

      const response = await api.deleteBreed(1);
      expect(response.success).toBe(true);
    });
  });

  describe('GET /api/breeds/search', () => {
    it('should search breeds by query', async () => {
      const searchResults = [
        {
          id: 1,
          name: 'Golden Retriever',
          breed_group: 'Sporting',
          temperament: 'Intelligent, Friendly, Devoted',
          life_span: '10-12 years',
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 },
          description: 'The Golden Retriever is a large-sized breed of dog.'
        }
      ];

      await provider.addInteraction({
        state: 'has breeds in database',
        uponReceiving: 'a search request for golden',
        withRequest: {
          method: 'GET',
          path: '/api/breeds/search',
          query: {
            q: 'golden'
          },
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            success: true,
            data: searchResults,
            message: 'Search completed successfully'
          }
        }
      });

      const response = await api.searchBreeds('golden');
      expect(response.data).toEqual(searchResults);
    });
  });
});
```

## Provider Tests

### Test Structure

```typescript
// src/pact/provider/dogBreedsApi.provider.test.ts
import { Verifier } from '@pact-foundation/pact';
import { providerConfig } from '../providerConfig';
import { app } from '../../index';
import { DatabaseService } from '../../database';

describe('Dog Breeds API Provider', () => {
  const verifier = new Verifier(providerConfig);

  beforeAll(async () => {
    // Start the API server
    await new Promise((resolve) => {
      const server = app.listen(3000, () => {
        console.log('Provider server started on port 3000');
        resolve(server);
      });
    });
  });

  it('should verify the consumer contract', async () => {
    const result = await verifier.verifyProvider();
    expect(result).toBe(true);
  });

  afterAll(async () => {
    // Cleanup
    await DatabaseService.close();
  });
});
```

## State Handlers

### Implementation

```typescript
// src/pact/stateHandlers.ts
import { DatabaseService } from '../database';
import { DogBreed } from '../types';

export const stateHandlers = {
  'has breeds in database': async () => {
    const breeds: DogBreed[] = [
      {
        id: 1,
        name: 'Golden Retriever',
        breed_group: 'Sporting',
        temperament: 'Intelligent, Friendly, Devoted',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'The Golden Retriever is a large-sized breed of dog.'
      },
      {
        id: 2,
        name: 'German Shepherd',
        breed_group: 'Herding',
        temperament: 'Intelligent, Confident, Courageous',
        life_span: '7-10 years',
        height_cm: { min: 55, max: 65 },
        weight_kg: { min: 22, max: 40 },
        description: 'The German Shepherd is a medium to large-sized working dog.'
      }
    ];

    await DatabaseService.clearBreeds();
    for (const breed of breeds) {
      await DatabaseService.createBreed(breed);
    }
  },

  'has breed with id 1': async () => {
    const breed: DogBreed = {
      id: 1,
      name: 'Golden Retriever',
      breed_group: 'Sporting',
      temperament: 'Intelligent, Friendly, Devoted',
      life_span: '10-12 years',
      height_cm: { min: 55, max: 61 },
      weight_kg: { min: 25, max: 34 },
      description: 'The Golden Retriever is a large-sized breed of dog.'
    };

    await DatabaseService.clearBreeds();
    await DatabaseService.createBreed(breed);
  },

  'breed does not exist': async () => {
    await DatabaseService.clearBreeds();
  },

  'database is empty': async () => {
    await DatabaseService.clearBreeds();
  },

  'API is running': async () => {
    // Verify API is healthy
    const response = await fetch('http://localhost:3000/health');
    if (!response.ok) {
      throw new Error('API is not running');
    }
  }
};
```

## Running Tests

### Consumer Tests (Generate Contracts)

```bash
# Run consumer tests to generate contracts
cd web-app
npm run test:pact:consumer

# This will:
# 1. Start the Pact mock server
# 2. Run consumer tests against the mock
# 3. Generate contract files in pacts/ directory
# 4. Optionally publish to Pact Broker
```

### Provider Tests (Verify Contracts)

```bash
# Run provider tests to verify contracts
npm run test:pact:provider

# This will:
# 1. Start the actual API server
# 2. Load contract files from pacts/ directory
# 3. Send requests to the API server
# 4. Verify responses match contracts
# 5. Report verification results
```

### Complete Pact Workflow

```bash
# 1. Setup Pact Broker (optional)
./pact-broker-setup.sh

# 2. Generate contracts (consumer)
cd web-app && npm run test:pact:consumer

# 3. Verify contracts (provider)
npm run test:pact:provider

# 4. View results in Pact Broker
open http://localhost:9292
```

## Package.json Scripts

### Consumer (Web App)

```json
{
  "scripts": {
    "test:pact:consumer": "jest --testPathPattern=pact/consumer --testTimeout=30000",
    "test:pact:consumer:watch": "jest --testPathPattern=pact/consumer --watch --testTimeout=30000",
    "pact:publish": "pact-broker publish pacts/ --consumer-app-version=1.0.0 --broker-base-url=http://localhost:9292 --broker-username=pact --broker-password=pact"
  }
}
```

### Provider (API Server)

```json
{
  "scripts": {
    "test:pact:provider": "jest --testPathPattern=pact/provider --testTimeout=30000",
    "test:pact:provider:watch": "jest --testPathPattern=pact/provider --watch --testTimeout=30000",
    "pact:verify": "pact-provider-verifier --provider-base-url=http://localhost:3000 --pact-broker-base-url=http://localhost:9292 --provider-app-version=1.0.0 --broker-username=pact --broker-password=pact"
  }
}
```

## Best Practices

### 1. Contract Design

- **Be specific about expectations**: Define exact request/response formats
- **Include edge cases**: Test error scenarios and boundary conditions
- **Use meaningful state names**: Make state handlers descriptive
- **Version contracts**: Use semantic versioning for contract changes

### 2. Test Organization

- **Group by endpoint**: Organize tests by API endpoint
- **Use descriptive test names**: Make test intentions clear
- **Include setup/teardown**: Ensure clean state between tests
- **Handle async operations**: Use proper async/await patterns

### 3. State Management

- **Keep states simple**: Each state should have a single responsibility
- **Use database transactions**: Ensure atomic state changes
- **Clean up after tests**: Reset state to avoid test interference
- **Document state purposes**: Comment on what each state does

### 4. Error Handling

- **Test error scenarios**: Include 404, 400, 500 responses
- **Validate error formats**: Ensure error responses match contracts
- **Handle timeouts**: Set appropriate timeouts for slow operations
- **Log failures**: Include detailed logging for debugging

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure Pact mock server port is available
2. **State handler failures**: Check database connectivity and permissions
3. **Contract mismatches**: Verify request/response formats match exactly
4. **Timeout errors**: Increase test timeouts for slow operations
5. **CORS issues**: Configure CORS properly for cross-origin requests

### Debug Commands

```bash
# Check Pact Broker status
curl -u pact:pact http://localhost:9292/diagnostic/status

# View contract files
ls -la pacts/

# Check provider logs
npm run test:pact:provider -- --verbose

# Verify specific contract
pact-provider-verifier --provider-base-url=http://localhost:3000 --pact-urls=pacts/dogbreedswebapp-dogbreedsapi.json
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
# .github/workflows/pact.yml
name: Pact Contract Testing

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  pact:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: pact_broker
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      pact-broker:
        image: pactfoundation/pact-broker:latest
        env:
          PACT_BROKER_DATABASE_URL: postgres://postgres:password@localhost/pact_broker
          PACT_BROKER_DATABASE_ADAPTER: postgres
          PACT_BROKER_BASIC_AUTH_USERNAME: pact
          PACT_BROKER_BASIC_AUTH_PASSWORD: pact
        ports:
          - 9292:9292
        depends_on:
          postgres:
            condition: service_healthy
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd web-app && npm ci
    
    - name: Run consumer tests
      run: |
        cd web-app
        npm run test:pact:consumer
    
    - name: Publish contracts
      run: |
        cd web-app
        npm run pact:publish
    
    - name: Run provider tests
      run: npm run test:pact:provider
```

This comprehensive Pact testing setup ensures reliable contract testing between the consumer (web app) and provider (API server), maintaining API compatibility and preventing breaking changes. 