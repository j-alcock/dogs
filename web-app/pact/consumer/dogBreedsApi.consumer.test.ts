import { Pact, Matchers } from '@pact-foundation/pact';
import { provider } from '../../src/test/setup';
import axios from 'axios';
const { like, eachLike } = Matchers;

const API_BASE_URL = `http://localhost:1234`;

describe('Dog Breeds API Consumer Contract Tests', () => {
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
    it('should return a list of dog breeds with pagination', async () => {
      const expectedResponse = {
        success: true,
        data: eachLike({
          id: like(1),
          name: like('Golden Retriever'),
          breed_group: like('Sporting'),
          temperament: like('Friendly, Intelligent, Devoted'),
          life_span: like('10-12 years'),
          height_cm: {
            min: like(55),
            max: like(61)
          },
          weight_kg: {
            min: like(25),
            max: like(34)
          },
          description: like('The Golden Retriever is a large-sized breed of dog bred as gun dogs to retrieve shot waterfowl.'),
          image_url: like('https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'),
          created_at: like('2025-07-01T03:28:30'),
          updated_at: like('2025-07-01T03:28:30')
        }),
        pagination: {
          page: like(1),
          limit: like(10),
          total: like(1),
          totalPages: like(1)
        }
      };

      await provider.addInteraction({
        state: 'has breeds in database',
        uponReceiving: 'a request for all breeds',
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

      const response = await axios.get(`${API_BASE_URL}/api/breeds?page=1&limit=10`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveLength(1);
      expect(response.data.data[0].name).toBe('Golden Retriever');
    });
  });

  describe('GET /api/breeds/search', () => {
    it('should return search results for breeds', async () => {
      const expectedResponse = {
        success: true,
        data: eachLike({
          id: like(1),
          name: like('Golden Retriever'),
          breed_group: like('Sporting'),
          temperament: like('Friendly, Intelligent, Devoted'),
          life_span: like('10-12 years'),
          height_cm: {
            min: like(55),
            max: like(61)
          },
          weight_kg: {
            min: like(25),
            max: like(34)
          },
          description: like('The Golden Retriever is a large-sized breed of dog bred as gun dogs to retrieve shot waterfowl.'),
          image_url: like('https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'),
          created_at: like('2025-07-01T03:28:30'),
          updated_at: like('2025-07-01T03:28:30')
        })
      };

      await provider.addInteraction({
        state: 'has breeds in database',
        uponReceiving: 'a search request for retriever breeds',
        withRequest: {
          method: 'GET',
          path: '/api/breeds/search',
          query: {
            q: 'retriever'
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

      const response = await axios.get(`${API_BASE_URL}/api/breeds/search?q=retriever`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
      expect(response.data.data.some((breed: any) => breed.name.includes('Retriever'))).toBe(true);
    });
  });

  describe('GET /api/breeds/:id', () => {
    it('should return a specific breed by ID', async () => {
      const expectedResponse = {
        success: true,
        data: {
          id: like(1),
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
          image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
          created_at: like('2025-07-01T03:28:30'),
          updated_at: like('2025-07-01T03:28:30')
        }
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
          body: expectedResponse
        }
      });

      const response = await axios.get(`${API_BASE_URL}/api/breeds/1`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.id).toBe(1);
      expect(response.data.data.name).toBe('Golden Retriever');
    });

    it('should return 404 for non-existent breed', async () => {
      const expectedResponse = {
        success: false,
        error: 'Breed not found'
      };

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
          body: expectedResponse
        }
      });

      try {
        await axios.get(`${API_BASE_URL}/api/breeds/999`);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe('POST /api/breeds', () => {
    it('should create a new breed', async () => {
      const newBreed = {
        name: 'Border Collie',
        breed_group: 'Herding',
        temperament: 'Intelligent, Energetic, Responsive',
        life_span: '12-15 years',
        height_cm: {
          min: 46,
          max: 56
        },
        weight_kg: {
          min: 14,
          max: 20
        },
        description: 'The Border Collie is a working and herding dog breed.',
        image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop'
      };

      const expectedResponse = {
        success: true,
        data: {
          id: like(2),
          ...newBreed,
          created_at: like('2025-07-01T03:28:30'),
          updated_at: like('2025-07-01T03:28:30')
        }
      };

      await provider.addInteraction({
        state: 'database is empty',
        uponReceiving: 'a request to create a new breed',
        withRequest: {
          method: 'POST',
          path: '/api/breeds',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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

      const response = await axios.post(`${API_BASE_URL}/api/breeds`, newBreed);
      
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data.name).toBe('Border Collie');
    });
  });

  describe('PUT /api/breeds/:id', () => {
    it('should update an existing breed', async () => {
      const updateData = {
        description: 'Updated description for Golden Retriever'
      };

      const expectedResponse = {
        success: true,
        data: {
          id: like(1),
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
          description: 'Updated description for Golden Retriever',
          image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
          created_at: like('2025-07-01T03:28:30'),
          updated_at: like('2025-07-01T03:28:30')
        }
      };

      await provider.addInteraction({
        state: 'has breed with id 1',
        uponReceiving: 'a request to update breed with id 1',
        withRequest: {
          method: 'PUT',
          path: '/api/breeds/1',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: updateData
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });

      const response = await axios.put(`${API_BASE_URL}/api/breeds/1`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.description).toBe('Updated description for Golden Retriever');
    });
  });

  describe('DELETE /api/breeds/:id', () => {
    it('should delete an existing breed', async () => {
      const expectedResponse = {
        success: true,
        message: 'Breed deleted successfully'
      };

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
          body: expectedResponse
        }
      });

      const response = await axios.delete(`${API_BASE_URL}/api/breeds/1`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const expectedResponse = {
        success: true,
        data: {
          status: 'OK',
          timestamp: like('2025-07-01T05:16:15.977Z')
        },
        message: 'Dog Breeds API is running'
      };

      await provider.addInteraction({
        state: 'API is running',
        uponReceiving: 'a health check request',
        withRequest: {
          method: 'GET',
          path: '/health',
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

      const response = await axios.get(`${API_BASE_URL}/health`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe('Dog Breeds API is running');
    });
  });
}); 