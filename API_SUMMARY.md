# Dog Breeds API - Complete Documentation

## 🎯 **Overview**

The Dog Breeds API is a modern, TypeScript-based REST API built with Express.js and SQLite. It provides comprehensive CRUD operations for managing dog breeds with robust validation, error handling, and testing.

## 🏗️ **Architecture**

```
src/
├── controllers/         # Request handlers
│   └── breedController.ts
├── database/           # Database service
│   └── index.ts
├── routes/             # Route definitions
│   └── breedRoutes.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── pact/               # Contract testing
│   ├── consumer/
│   └── provider/
├── errors/             # Custom error classes
└── index.ts            # Main application file
```

## 🚀 **Quick Start**

### Installation
```bash
cd dogs
npm install
npm run dev
```

### Access Points
- **API Base**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000

## 📊 **API Endpoints**

### Core Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/api/breeds` | Get all breeds (paginated) | ✅ |
| `GET` | `/api/breeds/search` | Search breeds by query | ✅ |
| `GET` | `/api/breeds/:id` | Get breed by ID | ✅ |
| `POST` | `/api/breeds` | Create new breed | ✅ |
| `PUT` | `/api/breeds/:id` | Update breed | ✅ |
| `DELETE` | `/api/breeds/:id` | Delete breed | ✅ |

### Additional Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/` | API documentation and endpoints list | ✅ |
| `GET` | `/health` | Health check | ✅ |
| `POST` | `/_pactSetup` | Pact provider state management | ✅ |

## 📋 **Detailed Endpoint Documentation**

### 1. Get All Breeds

**Endpoint**: `GET /api/breeds`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Request**:
```bash
curl "http://localhost:3000/api/breeds?page=1&limit=5"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Golden Retriever",
      "breed_group": "Sporting",
      "temperament": "Friendly, Intelligent, Devoted",
      "life_span": "10-12 years",
      "height_cm": { "min": 55, "max": 61 },
      "weight_kg": { "min": 25, "max": 34 },
      "description": "The Golden Retriever is a large-sized breed...",
      "image_url": "https://example.com/image.jpg",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 3,
    "totalPages": 1
  }
}
```

### 2. Search Breeds

**Endpoint**: `GET /api/breeds/search`

**Query Parameters**:
- `q` (required): Search query

**Example Request**:
```bash
curl "http://localhost:3000/api/breeds/search?q=golden"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Golden Retriever",
      "breed_group": "Sporting",
      "temperament": "Friendly, Intelligent, Devoted",
      "life_span": "10-12 years",
      "height_cm": { "min": 55, "max": 61 },
      "weight_kg": { "min": 25, "max": 34 },
      "description": "The Golden Retriever is a large-sized breed...",
      "image_url": "https://example.com/image.jpg",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "message": "Found 1 breeds matching \"golden\""
}
```

### 3. Get Breed by ID

**Endpoint**: `GET /api/breeds/:id`

**Example Request**:
```bash
curl "http://localhost:3000/api/breeds/1"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Golden Retriever",
    "breed_group": "Sporting",
    "temperament": "Friendly, Intelligent, Devoted",
    "life_span": "10-12 years",
    "height_cm": { "min": 55, "max": 61 },
    "weight_kg": { "min": 25, "max": 34 },
    "description": "The Golden Retriever is a large-sized breed...",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### 4. Create New Breed

**Endpoint**: `POST /api/breeds`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Border Collie",
  "breed_group": "Herding",
  "temperament": "Intelligent, Energetic, Responsive",
  "life_span": "12-15 years",
  "height_cm": { "min": 46, "max": 56 },
  "weight_kg": { "min": 14, "max": 20 },
  "description": "The Border Collie is a working and herding dog breed...",
  "image_url": "https://example.com/border-collie.jpg"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/breeds" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Border Collie",
    "breed_group": "Herding",
    "temperament": "Intelligent, Energetic, Responsive",
    "life_span": "12-15 years",
    "height_cm": { "min": 46, "max": 56 },
    "weight_kg": { "min": 14, "max": 20 },
    "description": "The Border Collie is a working and herding dog breed...",
    "image_url": "https://example.com/border-collie.jpg"
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Border Collie",
    "breed_group": "Herding",
    "temperament": "Intelligent, Energetic, Responsive",
    "life_span": "12-15 years",
    "height_cm": { "min": 46, "max": 56 },
    "weight_kg": { "min": 14, "max": 20 },
    "description": "The Border Collie is a working and herding dog breed...",
    "image_url": "https://example.com/border-collie.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "message": "Breed created successfully"
}
```

### 5. Update Breed

**Endpoint**: `PUT /api/breeds/:id`

**Headers**:
```
Content-Type: application/json
```

**Request Body** (partial update supported):
```json
{
  "name": "Updated Golden Retriever",
  "description": "Updated description for the Golden Retriever"
}
```

**Example Request**:
```bash
curl -X PUT "http://localhost:3000/api/breeds/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Golden Retriever",
    "description": "Updated description for the Golden Retriever"
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Golden Retriever",
    "breed_group": "Sporting",
    "temperament": "Friendly, Intelligent, Devoted",
    "life_span": "10-12 years",
    "height_cm": { "min": 55, "max": 61 },
    "weight_kg": { "min": 25, "max": 34 },
    "description": "Updated description for the Golden Retriever",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "message": "Breed updated successfully"
}
```

### 6. Delete Breed

**Endpoint**: `DELETE /api/breeds/:id`

**Example Request**:
```bash
curl -X DELETE "http://localhost:3000/api/breeds/1"
```

**Example Response**:
```json
{
  "success": true,
  "message": "Breed deleted successfully"
}
```

### 7. Health Check

**Endpoint**: `GET /health`

**Example Request**:
```bash
curl "http://localhost:3000/health"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2023-01-01T00:00:00Z"
  },
  "message": "Dog Breeds API is running"
}
```

## 📊 **Data Models**

### DogBreed Interface
```typescript
interface DogBreed {
  id?: number;
  name: string;
  breed_group: string;
  temperament: string;
  life_span: string;
  height_cm: {
    min: number;
    max: number;
  };
  weight_kg: {
    min: number;
    max: number;
  };
  description: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
```

### CreateDogBreedRequest Interface
```typescript
interface CreateDogBreedRequest {
  name: string;
  breed_group: string;
  temperament: string;
  life_span: string;
  height_cm: {
    min: number;
    max: number;
  };
  weight_kg: {
    min: number;
    max: number;
  };
  description: string;
  image_url?: string;
}
```

### ApiResponse Interface
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### PaginatedResponse Interface
```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## ✅ **Validation Rules**

### Required Fields
- `name`: 1-100 characters, unique
- `breed_group`: 1-50 characters
- `temperament`: 1-200 characters
- `life_span`: 1-50 characters
- `height_cm.min`: 1-200 cm
- `height_cm.max`: 1-200 cm
- `weight_kg.min`: 0.1-200 kg
- `weight_kg.max`: 0.1-200 kg
- `description`: 10-1000 characters

### Optional Fields
- `image_url`: Valid URL format

### Business Rules
- Height min cannot be greater than height max
- Weight min cannot be greater than weight max
- Breed names must be unique across the database

## 🚨 **Error Handling**

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (optional)"
}
```

### HTTP Status Codes

| Code | Description | Example |
|------|-------------|---------|
| `200` | Success | GET, PUT requests |
| `201` | Created | POST requests |
| `400` | Bad Request | Validation errors |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Duplicate breed name |
| `500` | Internal Server Error | Server errors |

### Common Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Name is required and must be between 1 and 100 characters"
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "error": "Breed not found"
}
```

#### Duplicate Breed Error (409)
```json
{
  "success": false,
  "error": "Breed with name 'Golden Retriever' already exists"
}
```

#### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## 🧪 **Testing**

### Test Coverage
- **Unit Tests**: Controller and service logic
- **Integration Tests**: API endpoint testing
- **Contract Tests**: Pact consumer/provider verification
- **Database Tests**: SQLite operation testing

### Running Tests
```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Pact contract tests
npm run test:pact

# Watch mode
npm run test:watch
```

### Test Structure
```
src/
├── __tests__/
│   ├── breedController.test.ts
│   └── databaseService.test.ts
├── pact/
│   ├── consumer/
│   │   └── dogBreedsApi.consumer.test.ts
│   └── provider/
│       └── dogBreedsApi.provider.test.ts
└── test/
    └── setup.ts
```

## 🔧 **Configuration**

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HOST` | `localhost` | Server host |
| `NODE_ENV` | `development` | Environment mode |

### Database Configuration
```typescript
const dbConfig = {
  filename: './dog_breeds.db'  // SQLite database file
};
```

## 🚀 **Development**

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:pact` | Run Pact contract tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |

### Development Workflow
1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm run dev`
3. **Run Tests**: `npm test`
4. **Check Code Quality**: `npm run lint`

## 📊 **Performance**

### Database Optimization
- **Indexing**: Primary key on `id`, unique index on `name`
- **Queries**: Optimized SQL queries with proper joins
- **Connection Pooling**: SQLite connection management

### API Performance
- **Pagination**: Efficient pagination for large datasets
- **Search**: Full-text search with SQLite FTS
- **Caching**: Ready for Redis integration
- **Compression**: Express compression ready

## 🔒 **Security**

### Security Features
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS**: Proper cross-origin handling
- **Security Headers**: Helmet.js protection
- **Rate Limiting**: Ready for implementation

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 📈 **Monitoring**

### Health Check
- **Endpoint**: `GET /health`
- **Response Time**: < 100ms
- **Database Status**: Connection verification
- **Memory Usage**: Process monitoring

### Logging
- **Request Logging**: Morgan HTTP logger
- **Error Logging**: Console and file logging
- **Performance Logging**: Response time tracking

## 🔄 **CI/CD Integration**

### GitHub Actions Workflow
The API is integrated with a comprehensive CI/CD pipeline that:

1. **Installs Dependencies** - Node.js and npm packages
2. **Builds Application** - TypeScript compilation
3. **Runs Unit Tests** - Jest-based testing
4. **Runs Contract Tests** - Pact verification
5. **Reports Results** - Detailed test results

### Workflow Triggers
- Push to main branch
- Pull requests to main branch

## 📚 **Documentation**

### API Documentation
- **Interactive Docs**: Available at http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Endpoint List**: Root endpoint provides complete list

### Additional Resources
- **[Main README](README.md)** - Complete system overview
- **[Web App Documentation](WEB_APP_SUMMARY.md)** - Frontend system overview
- **[Pact Testing Guide](PACT_TESTING.md)** - Contract testing setup
- **[Demo System](demo-system.sh)** - Complete system demonstration

## 🎉 **Sample Data**

The API comes pre-seeded with three popular dog breeds:

1. **Golden Retriever** - Sporting group
2. **German Shepherd** - Herding group  
3. **Labrador Retriever** - Sporting group

You can start using the API immediately without adding any data!

## 🔗 **Quick Links**

- **API Base**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000
- **GitHub Repository**: [Your Repository URL]

---

**This API provides a robust, scalable foundation for the Dog Breeds management system with comprehensive testing, security, and documentation.** 