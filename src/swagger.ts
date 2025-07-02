import swaggerJsdoc from 'swagger-jsdoc';
import { DogBreed, CreateDogBreedRequest, ApiResponse, PaginatedResponse } from './types';

// Swagger configuration
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dog Breeds API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing dog breeds with full CRUD operations, search, and pagination.',
      contact: {
        name: 'API Support',
        email: 'support@dogbreedsapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        DogBreed: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Golden Retriever' },
            breed_group: { type: 'string', example: 'Sporting' },
            temperament: { type: 'string', example: 'Intelligent, Friendly, Devoted' },
            life_span: { type: 'string', example: '10-12 years' },
            height_cm: {
              type: 'object',
              properties: {
                min: { type: 'number', example: 55 },
                max: { type: 'number', example: 61 }
              }
            },
            weight_kg: {
              type: 'object',
              properties: {
                min: { type: 'number', example: 25 },
                max: { type: 'number', example: 34 }
              }
            },
            description: { type: 'string', example: 'The Golden Retriever is a large-sized breed of dog...' },
            image_url: { type: 'string', example: 'https://example.com/golden-retriever.jpg' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          required: ['name', 'breed_group', 'temperament', 'life_span', 'height_cm', 'weight_kg', 'description']
        },
        CreateDogBreedRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Border Collie' },
            breed_group: { type: 'string', example: 'Herding' },
            temperament: { type: 'string', example: 'Intelligent, Energetic, Responsive' },
            life_span: { type: 'string', example: '12-15 years' },
            height_cm: {
              type: 'object',
              properties: {
                min: { type: 'number', example: 46 },
                max: { type: 'number', example: 56 }
              }
            },
            weight_kg: {
              type: 'object',
              properties: {
                min: { type: 'number', example: 14 },
                max: { type: 'number', example: 20 }
              }
            },
            description: { type: 'string', example: 'The Border Collie is a working and herding dog breed.' },
            image_url: { type: 'string', example: 'https://example.com/border-collie.jpg' }
          },
          required: ['name', 'breed_group', 'temperament', 'life_span', 'height_cm', 'weight_kg', 'description']
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operation completed successfully' },
            error: { type: 'string' }
          },
          required: ['success']
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/DogBreed' }
            },
            message: { type: 'string', example: 'Breeds retrieved successfully' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 50 },
                totalPages: { type: 'integer', example: 5 }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation error' },
            message: { type: 'string', example: 'Invalid input data' }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'OK' },
                timestamp: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string', example: 'Dog Breeds API is running' }
          }
        }
      },
      parameters: {
        Page: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: { type: 'integer', default: 1, minimum: 1 }
        },
        Limit: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 }
        },
        SearchQuery: {
          name: 'q',
          in: 'query',
          description: 'Search query for breed name, group, or temperament',
          required: true,
          schema: { type: 'string', minLength: 1 }
        },
        BreedId: {
          name: 'id',
          in: 'path',
          description: 'Breed ID',
          required: true,
          schema: { type: 'integer', minimum: 1 }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check and API information endpoints'
      },
      {
        name: 'Breeds',
        description: 'Dog breed management operations'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/index.ts']
};

// Generate Swagger specification
export const specs = swaggerJsdoc(options);

// Export for backward compatibility
export default specs; 