import { Verifier } from '@pact-foundation/pact';
import { pactConfig } from '../../src/test/setup';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { DatabaseService } from '../../src/database';
import { BreedController } from '../../src/controllers/breedController';
import { createBreedRoutes } from '../../src/routes/breedRoutes';

describe('Dog Breeds API Provider Contract Tests', () => {
  let server: any;
  let dbService: DatabaseService;
  let app: express.Application;

  beforeAll(async () => {
    // Create database service instance
    dbService = new DatabaseService({ filename: './dog_breeds_test.db' });
    
    // Create a new Express app with the same database instance
    app = express();
    
    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(morgan('combined'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Initialize controller with the same database instance
    const breedController = new BreedController(dbService);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      const response = {
        success: true,
        data: {
          status: 'OK',
          timestamp: new Date().toISOString()
        },
        message: 'Dog Breeds API is running'
      };
      res.status(200).json(response);
    });
    
    // API routes
    app.use('/api/breeds', createBreedRoutes(breedController));
    
    // Root endpoint
    app.get('/', (req, res) => {
      const response = {
        success: true,
        data: {
          name: 'Dog Breeds API',
          version: '1.0.0',
          description: 'A TypeScript API for managing dog breeds with CRUD operations',
          endpoints: [
            'GET /api/breeds - Get all breeds (with pagination)',
            'GET /api/breeds/search?q=query - Search breeds',
            'GET /api/breeds/:id - Get breed by ID',
            'POST /api/breeds - Create new breed',
            'PUT /api/breeds/:id - Update breed',
            'DELETE /api/breeds/:id - Delete breed',
            'GET /health - Health check'
          ]
        },
        message: 'Welcome to the Dog Breeds API!'
      };
      res.status(200).json(response);
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      const response = {
        success: false,
        error: 'Route not found'
      };
      res.status(404).json(response);
    });
    
    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      const response = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    });
    
    // Start the API server on a different port to avoid conflicts
    server = app.listen(3001, () => {
      console.log('Provider API server running on port 3001');
    });
  });

  afterAll(async () => {
    // Close the server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Server closed');
          resolve();
        });
      });
    }
    
    // Close database connection
    if (dbService) {
      dbService.close();
      console.log('Database connection closed');
    }
  }, 10000); // 10 second timeout

  it('should validate the expectations of DogBreedsWebApp', async () => {
    const opts = {
      provider: pactConfig.provider,
      providerBaseUrl: 'http://localhost:3001',
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'dogbreedswebapp-dogbreedsapi.json')],
      publishVerificationResult: false,
      providerVersion: '1.0.0',
      logLevel: 'info' as const,
      timeout: 60000, // 60 second timeout
      disableSSLVerification: true,
      stateHandlers: {
        'API is running': async () => {
          console.log('State: API is running');
          return Promise.resolve();
        },
        'breed does not exist': async () => {
          console.log('State: breed does not exist');
          // Ensure breed with id 999 doesn't exist (already the case)
          return Promise.resolve();
        },
        'database is empty': async () => {
          console.log('State: clearing database');
          await dbService.clearDatabase();
          return Promise.resolve();
        },
        'has breed with id 1': async () => {
          console.log('State: has breed with id 1');
          await dbService.clearDatabase();
          await (dbService as any).runRaw("DELETE FROM sqlite_sequence WHERE name='dog_breeds';");
          await dbService.createBreed({
            name: 'Golden Retriever',
            breed_group: 'Sporting',
            temperament: 'Friendly, Intelligent, Devoted',
            life_span: '10-12 years',
            height_cm: {
              min: 55,
              max: 61
            },
            weight_kg: {
              min: 25,
              max: 34
            },
            description: 'The Golden Retriever is a large-sized breed of dog bred as gun dogs to retrieve shot waterfowl.',
            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
          });
          return Promise.resolve();
        },
        'has breeds in database': async () => {
          console.log('State: has breeds in database');
          await dbService.clearDatabase();
          await (dbService as any).runRaw("DELETE FROM sqlite_sequence WHERE name='dog_breeds';");
          
          // Add only Golden Retriever (id 1) to match consumer expectations
          await dbService.createBreed({
            name: 'Golden Retriever',
            breed_group: 'Sporting',
            temperament: 'Friendly, Intelligent, Devoted',
            life_span: '10-12 years',
            height_cm: {
              min: 55,
              max: 61
            },
            weight_kg: {
              min: 25,
              max: 34
            },
            description: 'The Golden Retriever is a large-sized breed of dog bred as gun dogs to retrieve shot waterfowl.',
            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
          });
          
          return Promise.resolve();
        }
      }
    };

    try {
      await new Verifier(opts).verifyProvider();
    } catch (error) {
      console.error('Provider verification failed:', error);
      throw error;
    }
  }, 120000); // 2 minute timeout for the test
}); 