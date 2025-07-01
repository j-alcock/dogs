import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { DatabaseService } from './database';
import { BreedController } from './controllers/breedController';
import { createBreedRoutes } from './routes/breedRoutes';
import { ApiResponse } from './types';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Database configuration
const dbConfig = {
  filename: './dog_breeds.db'
};

// Initialize database
const dbService = new DatabaseService(dbConfig);

// Initialize controller
const breedController = new BreedController(dbService);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
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

// Pact provider state change endpoint
app.post('/_pactSetup', express.json(), async (req, res) => {
  try {
    const { state } = req.body;
    console.log('Setting up provider state:', state);
    
    switch (state) {
      case 'has breeds in database':
        // Ensure database has breeds (already seeded)
        break;
      case 'has breed with id 1':
        // Ensure breed with id 1 exists (already seeded)
        break;
      case 'breed does not exist':
        // Ensure breed with id 999 does not exist (already the case)
        break;
      case 'database is empty':
        // Clear the database for creation tests
        await dbService.clearDatabase();
        break;
      case 'API is running':
        // API is already running
        break;
      default:
        console.log('Unknown state:', state);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error setting up provider state:', error);
    res.status(500).json({ error: 'Failed to set up provider state' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  const response: ApiResponse<{
    name: string;
    version: string;
    description: string;
    endpoints: string[];
  }> = {
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
  const response: ApiResponse<null> = {
    success: false,
    error: 'Route not found'
  };
  res.status(404).json(response);
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  const response: ApiResponse<null> = {
    success: false,
    error: 'Internal server error'
  };
  
  res.status(500).json(response);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  dbService.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  dbService.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dog Breeds API server running at http://${HOST}:${PORT}`);
  console.log(`📚 API Documentation available at http://${HOST}:${PORT}`);
  console.log(`🏥 Health check available at http://${HOST}:${PORT}/health`);
});

export default app; 