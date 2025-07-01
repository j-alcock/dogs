# Dog Breeds API

A modern, TypeScript-based REST API for performing CRUD operations on a database of dog breeds. Built with Express.js, SQLite, and comprehensive validation.

## Features

- 🐕 **Complete CRUD Operations** - Create, Read, Update, Delete dog breeds
- 🔍 **Search Functionality** - Search breeds by name, breed group, or temperament
- 📄 **Pagination** - Efficient pagination for large datasets
- ✅ **Input Validation** - Comprehensive validation using express-validator
- 🛡️ **Security** - Helmet.js for security headers, CORS support
- 📊 **SQLite Database** - Lightweight, file-based database with automatic seeding
- 🧪 **Testing** - Jest-based test suite with mocking
- 📝 **TypeScript** - Full type safety and IntelliSense support
- 🚀 **Modern Architecture** - Clean separation of concerns with controllers, services, and routes

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd dogs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **The API will be available at:**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/breeds
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get all breeds (with pagination) |
| `GET` | `/search?q=query` | Search breeds |
| `GET` | `/:id` | Get breed by ID |
| `POST` | `/` | Create new breed |
| `PUT` | `/:id` | Update breed |
| `DELETE` | `/:id` | Delete breed |

### Additional Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API documentation and endpoints list |
| `GET` | `/health` | Health check |

## API Documentation

### Get All Breeds
```http
GET /api/breeds?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
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
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Breed by ID
```http
GET /api/breeds/1
```

**Response:**
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

### Create New Breed
```http
POST /api/breeds
Content-Type: application/json
```

**Request Body:**
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

**Response:**
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

### Update Breed
```http
PUT /api/breeds/1
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "name": "Updated Golden Retriever",
  "description": "Updated description for the Golden Retriever"
}
```

**Response:**
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

### Delete Breed
```http
DELETE /api/breeds/1
```

**Response:**
```json
{
  "success": true,
  "message": "Breed deleted successfully"
}
```

### Search Breeds
```http
GET /api/breeds/search?q=golden
```

**Response:**
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

## Data Model

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

## Validation Rules

### Required Fields
- `name`: 1-100 characters
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
- Breed names must be unique

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (optional)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Project Structure

```
src/
├── __tests__/           # Test files
├── controllers/         # Request handlers
├── database/           # Database service
├── routes/             # Route definitions
├── types/              # TypeScript interfaces
└── index.ts            # Main application file
```

### Database

The application uses SQLite for simplicity. The database file (`dog_breeds.db`) is automatically created on first run and seeded with sample data.

### Testing

Tests are written using Jest and Supertest. Run the test suite:

```bash
npm test
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HOST` | `localhost` | Server host |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Sample Data

The API comes pre-seeded with three popular dog breeds:
- Golden Retriever
- German Shepherd
- Labrador Retriever

You can start using the API immediately without adding any data! 