import request from 'supertest';
import express from 'express';
import { DatabaseService } from '../database';
import { BreedController } from '../controllers/breedController';
import { createBreedRoutes } from '../routes/breedRoutes';

// Mock database for testing
jest.mock('../database');

describe('BreedController', () => {
  let app: express.Application;
  let mockDbService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());

    // Create mock database service
    mockDbService = {
      getAllBreeds: jest.fn().mockResolvedValue({ breeds: [], total: 0 }),
      getBreedById: jest.fn(),
      createBreed: jest.fn(),
      updateBreed: jest.fn(),
      deleteBreed: jest.fn(),
      searchBreeds: jest.fn(),
      close: jest.fn()
    } as any;

    // Create controller and routes
    const breedController = new BreedController(mockDbService);
    app.use('/api/breeds', createBreedRoutes(breedController));
  });

  describe('GET /api/breeds', () => {
    it('should return all breeds with pagination', async () => {
      const mockBreeds = [
        {
          id: 1,
          name: 'Golden Retriever',
          breed_group: 'Sporting',
          temperament: 'Friendly, Intelligent, Devoted',
          life_span: '10-12 years',
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 },
          description: 'A friendly dog breed',
          image_url: 'https://example.com/image.jpg',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      mockDbService.getAllBreeds.mockResolvedValue({
        breeds: mockBreeds,
        total: 1
      });

      const response = await request(app)
        .get('/api/breeds')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockBreeds);
      expect(response.body.pagination).toBeDefined();
    });

    it('should handle invalid pagination parameters', async () => {
      const response = await request(app)
        .get('/api/breeds?page=0&limit=0');

      console.log('Response status:', response.status);
      console.log('Response body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid pagination parameters');
      expect(mockDbService.getAllBreeds).not.toHaveBeenCalled();
    });

    it('should handle negative pagination parameters', async () => {
      const response = await request(app)
        .get('/api/breeds?page=-1&limit=-5')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid pagination parameters');
      expect(mockDbService.getAllBreeds).not.toHaveBeenCalled();
    });

    it('should handle non-numeric pagination parameters', async () => {
      const response = await request(app)
        .get('/api/breeds?page=abc&limit=xyz')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid pagination parameters');
      expect(mockDbService.getAllBreeds).not.toHaveBeenCalled();
    });

    it('should handle limit exceeding maximum', async () => {
      const response = await request(app)
        .get('/api/breeds?page=1&limit=101')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid pagination parameters');
      expect(mockDbService.getAllBreeds).not.toHaveBeenCalled();
    });

    it('should handle empty pagination parameters', async () => {
      const response = await request(app)
        .get('/api/breeds?page=&limit=')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid pagination parameters');
      expect(mockDbService.getAllBreeds).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/breeds/:id', () => {
    it('should return a breed by ID', async () => {
      const mockBreed = {
        id: 1,
        name: 'Golden Retriever',
        breed_group: 'Sporting',
        temperament: 'Friendly, Intelligent, Devoted',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'A friendly dog breed',
        image_url: 'https://example.com/image.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockDbService.getBreedById.mockResolvedValue(mockBreed);

      const response = await request(app)
        .get('/api/breeds/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockBreed);
    });

    it('should return 404 for non-existent breed', async () => {
      mockDbService.getBreedById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/breeds/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Breed not found');
    });

    it('should handle invalid ID', async () => {
      const response = await request(app)
        .get('/api/breeds/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid breed ID');
    });
  });

  describe('POST /api/breeds', () => {
    it('should create a new breed', async () => {
      const newBreedData = {
        name: 'Test Breed',
        breed_group: 'Test Group',
        temperament: 'Friendly',
        life_span: '10-12 years',
        height_cm: { min: 50, max: 60 },
        weight_kg: { min: 20, max: 30 },
        description: 'A test breed for testing purposes'
      };

      const createdBreed = {
        id: 1,
        ...newBreedData,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockDbService.createBreed.mockResolvedValue(createdBreed);

      const response = await request(app)
        .post('/api/breeds')
        .send(newBreedData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(createdBreed);
      expect(response.body.message).toBe('Breed created successfully');
    });

    it('should validate required fields', async () => {
      const invalidBreedData = {
        name: '', // Invalid: empty name
        breed_group: 'Test Group',
        temperament: 'Friendly',
        life_span: '10-12 years',
        height_cm: { min: 50, max: 60 },
        weight_kg: { min: 20, max: 30 },
        description: 'A test breed'
      };

      const response = await request(app)
        .post('/api/breeds')
        .send(invalidBreedData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('PUT /api/breeds/:id', () => {
    it('should update an existing breed', async () => {
      const updateData = {
        name: 'Updated Breed Name',
        description: 'Updated description'
      };

      const updatedBreed = {
        id: 1,
        name: 'Updated Breed Name',
        breed_group: 'Sporting',
        temperament: 'Friendly, Intelligent, Devoted',
        life_span: '10-12 years',
        height_cm: { min: 55, max: 61 },
        weight_kg: { min: 25, max: 34 },
        description: 'Updated description',
        image_url: 'https://example.com/image.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockDbService.updateBreed.mockResolvedValue(updatedBreed);

      const response = await request(app)
        .put('/api/breeds/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedBreed);
      expect(response.body.message).toBe('Breed updated successfully');
    });

    it('should return 404 for non-existent breed', async () => {
      mockDbService.updateBreed.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/breeds/999')
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Breed not found');
    });
  });

  describe('DELETE /api/breeds/:id', () => {
    it('should delete an existing breed', async () => {
      mockDbService.deleteBreed.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/breeds/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Breed deleted successfully');
    });

    it('should return 404 for non-existent breed', async () => {
      mockDbService.deleteBreed.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/breeds/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Breed not found');
    });
  });

  describe('GET /api/breeds/search', () => {
    it('should search breeds by query', async () => {
      const searchResults = [
        {
          id: 1,
          name: 'Golden Retriever',
          breed_group: 'Sporting',
          temperament: 'Friendly, Intelligent, Devoted',
          life_span: '10-12 years',
          height_cm: { min: 55, max: 61 },
          weight_kg: { min: 25, max: 34 },
          description: 'A friendly dog breed',
          image_url: 'https://example.com/image.jpg',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      mockDbService.searchBreeds.mockResolvedValue(searchResults);

      const response = await request(app)
        .get('/api/breeds/search?q=golden')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(searchResults);
      expect(response.body.message).toContain('Found 1 breeds');
    });

    it('should require search query', async () => {
      const response = await request(app)
        .get('/api/breeds/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Search query is required');
    });
  });

  describe('Direct Controller Tests', () => {
    it('should validate pagination parameters directly', async () => {
      const breedController = new BreedController(mockDbService);
      
      // Mock request and response objects
      const mockReq = {
        query: { page: '0', limit: '0' }
      } as any;
      
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as any;

      await breedController.getAllBreeds(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
      });
    });
  });
}); 