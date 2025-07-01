import { Verifier } from '@pact-foundation/pact';
import { pactConfig } from '../../test/setup';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { DatabaseService } from '../../database';
import { BreedController } from '../../controllers/breedController';
import { createBreedRoutes } from '../../routes/breedRoutes';

describe('Dog Breeds API Provider Contract Tests', () => {
  let server: any;
  let dbService: DatabaseService;
  let app: express.Application;
  let port: number;

  beforeAll(async () => {
    // Create database service instance
    dbService = new DatabaseService({ filename: './dog_breeds_test.db' });
    
    // Create a new Express app with the same database instance
    app = express();

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
    
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
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(response);
    });

    // Debug endpoint to dump DB state
    app.get('/debug', async (req, res) => {
      try {
        const allBreeds = await dbService.getAllBreeds(1, 100);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          breeds: allBreeds.breeds,
          total: allBreeds.total
        });
      } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Failed to fetch DB state', details: err });
      }
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
            'GET /health - Health check',
            'GET /debug - Dump DB state'
          ]
        },
        message: 'Welcome to the Dog Breeds API!'
      };
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(response);
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      const response = {
        success: false,
        error: 'Route not found'
      };
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json(response);
    });
    
    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      const response = {
        success: false,
        error: 'Internal server error',
        details: err && err.message ? err.message : err
      };
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json(response);
    });
    
    // Start the API server on a random available port to avoid conflicts
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = (server.address() as any).port;
        console.log('Provider API server running on port', port);
        resolve();
      });
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
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'dogbreedswebapp-dogbreedsapi.json')],
      publishVerificationResult: false,
      providerVersion: '1.0.0',
      logLevel: 'info' as const,
      timeout: 60000, // 60 second timeout
      disableSSLVerification: true,
      stateHandlers: {
        'API is running': async () => {
          try {
            console.log('State: API is running');
            return Promise.resolve();
          } catch (error) {
            console.error('Error in API is running state handler:', error);
            return Promise.reject(error);
          }
        },
        'breed does not exist': async () => {
          try {
            console.log('State: breed does not exist');
            // Ensure breed with id 999 doesn't exist (already the case)
            return Promise.resolve();
          } catch (error) {
            console.error('Error in breed does not exist state handler:', error);
            return Promise.reject(error);
          }
        },
        'database is empty': async () => {
          try {
            console.log('State: clearing database');
            await dbService.clearDatabase();
            const allBreeds = await dbService.getAllBreeds();
            console.log('DB after clear:', allBreeds);
            return Promise.resolve();
          } catch (error) {
            console.error('Error in database is empty state handler:', error);
            return Promise.reject(error);
          }
        },
        'has breed with id 1': async () => {
          try {
            console.log('State: has breed with id 1');
            await dbService.clearDatabase();
            await (dbService as any).runRaw("DELETE FROM sqlite_sequence WHERE name='dog_breeds';");
            const breed = await dbService.createBreed({
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
            console.log('Breed created:', breed);
            const check = await dbService.getBreedById(1);
            console.log('Breed with id 1 after creation:', check);
            return Promise.resolve();
          } catch (error) {
            console.error('Error in has breed with id 1 state handler:', error);
            return Promise.reject(error);
          }
        },
        'has breeds in database': async () => {
          try {
            console.log('State: has breeds in database');
            await dbService.clearDatabase();
            await (dbService as any).runRaw("DELETE FROM sqlite_sequence WHERE name='dog_breeds';");
            const breed = await dbService.createBreed({
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
            console.log('Breed created:', breed);
            const allBreeds = await dbService.getAllBreeds();
            console.log('All breeds after creation:', allBreeds);
            return Promise.resolve();
          } catch (error) {
            console.error('Error in has breeds in database state handler:', error);
            return Promise.reject(error);
          }
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