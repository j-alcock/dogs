#!/usr/bin/env node

/**
 * Script to generate OpenAPI specification as JSON file
 * This allows external tools to consume the API documentation
 */

const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
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
      },
      {
        url: 'https://api.dogbreeds.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        DogBreed: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the breed',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Name of the dog breed',
              example: 'Golden Retriever',
              minLength: 1,
              maxLength: 100
            },
            breed_group: {
              type: 'string',
              description: 'Breed group classification',
              example: 'Sporting',
              enum: ['Sporting', 'Hound', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 'Herding']
            },
            temperament: {
              type: 'string',
              description: 'Temperament characteristics',
              example: 'Friendly, Intelligent, Devoted',
              maxLength: 200
            },
            life_span: {
              type: 'string',
              description: 'Average life span',
              example: '10-12 years',
              maxLength: 50
            },
            height_cm: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  description: 'Minimum height in centimeters',
                  example: 55,
                  minimum: 1,
                  maximum: 200
                },
                max: {
                  type: 'number',
                  description: 'Maximum height in centimeters',
                  example: 61,
                  minimum: 1,
                  maximum: 200
                }
              },
              required: ['min', 'max']
            },
            weight_kg: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  description: 'Minimum weight in kilograms',
                  example: 25,
                  minimum: 0.1,
                  maximum: 200
                },
                max: {
                  type: 'number',
                  description: 'Maximum weight in kilograms',
                  example: 34,
                  minimum: 0.1,
                  maximum: 200
                }
              },
              required: ['min', 'max']
            },
            description: {
              type: 'string',
              description: 'Detailed description of the breed',
              example: 'The Golden Retriever is a large-sized breed of dog bred as gun dogs to retrieve shot waterfowl.',
              minLength: 10,
              maxLength: 1000
            },
            image_url: {
              type: 'string',
              description: 'URL to breed image',
              example: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
              format: 'uri'
            },
            created_at: {
              type: 'string',
              description: 'Creation timestamp',
              example: '2023-01-01T00:00:00Z',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              description: 'Last update timestamp',
              example: '2023-01-01T00:00:00Z',
              format: 'date-time'
            }
          },
          required: ['name', 'breed_group', 'temperament', 'life_span', 'height_cm', 'weight_kg', 'description']
        },
        CreateDogBreedRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the dog breed',
              example: 'Border Collie',
              minLength: 1,
              maxLength: 100
            },
            breed_group: {
              type: 'string',
              description: 'Breed group classification',
              example: 'Herding',
              enum: ['Sporting', 'Hound', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 'Herding']
            },
            temperament: {
              type: 'string',
              description: 'Temperament characteristics',
              example: 'Intelligent, Energetic, Responsive',
              maxLength: 200
            },
            life_span: {
              type: 'string',
              description: 'Average life span',
              example: '12-15 years',
              maxLength: 50
            },
            height_cm: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  description: 'Minimum height in centimeters',
                  example: 46,
                  minimum: 1,
                  maximum: 200
                },
                max: {
                  type: 'number',
                  description: 'Maximum height in centimeters',
                  example: 56,
                  minimum: 1,
                  maximum: 200
                }
              },
              required: ['min', 'max']
            },
            weight_kg: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  description: 'Minimum weight in kilograms',
                  example: 14,
                  minimum: 0.1,
                  maximum: 200
                },
                max: {
                  type: 'number',
                  description: 'Maximum weight in kilograms',
                  example: 20,
                  minimum: 0.1,
                  maximum: 200
                }
              },
              required: ['min', 'max']
            },
            description: {
              type: 'string',
              description: 'Detailed description of the breed',
              example: 'The Border Collie is a working and herding dog breed.',
              minLength: 10,
              maxLength: 1000
            },
            image_url: {
              type: 'string',
              description: 'URL to breed image',
              example: 'https://example.com/border-collie.jpg',
              format: 'uri'
            }
          },
          required: ['name', 'breed_group', 'temperament', 'life_span', 'height_cm', 'weight_kg', 'description']
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
              example: true
            },
            data: {
              description: 'Response data (varies by endpoint)'
            },
            error: {
              type: 'string',
              description: 'Error message if success is false',
              example: 'Breed not found'
            },
            message: {
              type: 'string',
              description: 'Additional information or success message',
              example: 'Breed created successfully'
            }
          },
          required: ['success']
        },
        PaginatedResponse: {
          allOf: [
            {
              $ref: '#/components/schemas/ApiResponse'
            },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/DogBreed'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      description: 'Current page number',
                      example: 1
                    },
                    limit: {
                      type: 'integer',
                      description: 'Items per page',
                      example: 10
                    },
                    total: {
                      type: 'integer',
                      description: 'Total number of items',
                      example: 25
                    },
                    totalPages: {
                      type: 'integer',
                      description: 'Total number of pages',
                      example: 3
                    }
                  }
                }
              }
            }
          ]
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed'
            },
            message: {
              type: 'string',
              description: 'Additional error details',
              example: 'Name is required and must be between 1 and 100 characters'
            }
          },
          required: ['success', 'error']
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'OK'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-01-01T00:00:00Z'
                }
              }
            },
            message: {
              type: 'string',
              example: 'Dog Breeds API is running'
            }
          }
        }
      },
      parameters: {
        BreedId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Unique identifier of the breed',
          schema: {
            type: 'integer',
            minimum: 1
          },
          example: 1
        },
        Page: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          example: 1
        },
        Limit: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          },
          example: 10
        },
        SearchQuery: {
          name: 'q',
          in: 'query',
          required: true,
          description: 'Search query for breeds',
          schema: {
            type: 'string',
            minLength: 1
          },
          example: 'golden'
        }
      }
    },
    tags: [
      {
        name: 'Breeds',
        description: 'Operations related to dog breeds'
      },
      {
        name: 'Health',
        description: 'Health check and system status'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/index.ts'
  ]
};

try {
  const specs = swaggerJsdoc(options);
  
  // Create docs directory if it doesn't exist
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Write the OpenAPI specification to a JSON file
  const outputPath = path.join(docsDir, 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  
  console.log('✅ OpenAPI specification generated successfully!');
  console.log(`📄 Output file: ${outputPath}`);
  console.log(`🌐 API Documentation: http://localhost:3000/api-docs`);
  
} catch (error) {
  console.error('❌ Error generating OpenAPI specification:', error);
  process.exit(1);
} 