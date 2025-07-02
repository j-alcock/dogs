# Dog Breeds System

A complete, full-stack web application for managing dog breeds, featuring a TypeScript/Express.js backend API and a modern React frontend with comprehensive testing.

## 📋 Table of Contents

- [Installation](#installation)
- [API](#api)
- [Swagger Documentation](#swagger-documentation)
- [Frontend](#frontend)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [Functional Tests](#functional-tests)
  - [Contract Tests](#contract-tests)
  - [UI Tests](#ui-tests)
- [CI/CD](#cicd)
- [Contributing](#contributing)

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd dogs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd web-app && npm install && cd ..
   ```

3. **Start the system:**
   ```bash
   # Terminal 1: Start backend API
   npm run dev
   
   # Terminal 2: Start frontend web app
   cd web-app && npm run dev
   ```

4. **Access the application:**
   - **Web App**: http://localhost:3001
   - **API Documentation**: http://localhost:3000/api-docs
   - **Health Check**: http://localhost:3000/health

## 🔌 API

### Core Endpoints
- `GET /api/breeds` - Get all breeds (with pagination)
- `GET /api/breeds/search?q=query` - Search breeds
- `GET /api/breeds/:id` - Get breed by ID
- `POST /api/breeds` - Create new breed
- `PUT /api/breeds/:id` - Update breed
- `DELETE /api/breeds/:id` - Delete breed

### System Endpoints
- `GET /` - API information
- `GET /health` - Health check

### Example API Usage

**Get all breeds with pagination:**
```bash
curl "http://localhost:3000/api/breeds?page=1&limit=5"
```

**Search breeds:**
```bash
curl "http://localhost:3000/api/breeds/search?q=golden"
```

**Create a new breed:**
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
    "description": "The Border Collie is a working and herding dog breed."
  }'
```

### API Features
- Complete CRUD operations for dog breeds
- Search functionality across multiple fields
- Pagination for large datasets
- Input validation and error handling
- SQLite database with automatic seeding
- Security headers with Helmet.js
- Comprehensive testing with Jest
- Pact contract testing integration

## 📚 Swagger Documentation

### Interactive API Documentation
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json

### Adding New Endpoints
To document new endpoints, add JSDoc comments:

```typescript
/**
 * @swagger
 * /api/breeds/{id}:
 *   get:
 *     summary: Get breed by ID
 *     description: Retrieve a specific dog breed by its unique identifier
 *     tags: [Breeds]
 *     parameters:
 *       - $ref: '#/components/parameters/BreedId'
 *     responses:
 *       200:
 *         description: Successful response with breed data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DogBreed'
 */
router.get('/:id', breedController.getBreedById);
```

### External Tool Integration

**Postman:**
1. Import `docs/openapi.json` into Postman
2. All endpoints will be automatically configured

**Insomnia:**
1. Create a new API specification
2. Import `docs/openapi.json`

**Code Generation:**
```bash
# Using OpenAPI Generator
openapi-generator-cli generate -i docs/openapi.json -g typescript-fetch -o ./generated-client

# Using Swagger Codegen
swagger-codegen generate -i docs/openapi.json -l typescript-fetch -o ./generated-client
```

## 🎨 Frontend

### Features
- Modern React 18 with TypeScript
- Beautiful UI with Tailwind CSS
- Responsive design for all devices
- Real-time search and pagination
- Form validation and error handling
- Loading states and user feedback
- E2E testing with Playwright

### User Workflows

**Browse Breeds:**
- User visits the homepage
- Sees a grid of breed cards with images
- Can navigate through pages
- Can click on any breed to view details

**Search Breeds:**
- User clicks "Search" in navigation
- Enters search terms
- Results update in real-time
- Can search by name, group, or temperament

**Add New Breed:**
- User clicks "Add Breed" button
- Fills out comprehensive form
- Form validates input in real-time
- Breed is created and user is redirected

**Edit Breed:**
- User clicks edit icon on any breed
- Form is pre-populated with current data
- User can update any field
- Changes are saved and user is redirected

**Delete Breed:**
- User clicks delete icon
- Confirmation dialog appears
- Breed is removed from database
- List updates automatically

## 🧪 Testing

### Unit Tests

**Backend Unit Tests:**
```bash
npm run test:unit
```

Tests individual components in isolation:
- Controller logic
- Database service methods
- Utility functions
- Validation logic

**Frontend Unit Tests:**
```bash
cd web-app && npm test
```

Tests React components and utilities:
- Component rendering
- User interactions
- State management
- Utility functions

### Integration Tests

**API Integration Tests:**
```bash
npm test
```

Tests complete API workflows:
- Endpoint functionality
- Database integration
- Error handling
- Response formats

**Frontend Integration Tests:**
Tests component interactions:
- Form submissions
- API calls
- State updates
- Navigation flows

### Functional Tests

**Backend Functional Tests:**
Tests complete business logic:
- CRUD operations
- Search functionality
- Pagination
- Data validation

**Frontend Functional Tests:**
Tests user-facing functionality:
- Complete user workflows
- Data display
- Form interactions
- Error scenarios

### Contract Tests

Pact ensures API compatibility between the web app (consumer) and API (provider):

**Setup Pact Broker:**
```bash
./pact-broker-setup.sh
```

**Run Consumer Tests (Generate Contracts):**
```bash
cd web-app && npm run test:pact:consumer
```

**Run Provider Tests (Verify Contracts):**
```bash
npm run test:pact:provider
```

**Pact Configuration:**
```typescript
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
};
```

**State Handlers:**
- `has breeds in database` - Ensures breeds exist for testing
- `has breed with id 1` - Ensures specific breed exists
- `breed does not exist` - Ensures breed doesn't exist (for 404 tests)
- `database is empty` - Clears database for creation tests
- `API is running` - Ensures API is healthy


### UI Tests

**E2E Tests with Playwright:**
```bash
cd web-app && npx playwright test
```

Tests complete user workflows:
- User registration and login
- Breed management workflows
- Search and pagination
- Form validation
- Error handling

**UI Test Features:**
- Cross-browser testing (Chrome, Firefox, Safari)
- Visual regression testing
- Performance testing
- Accessibility testing
- Mobile responsiveness testing

## 🔄 CI/CD

### GitHub Actions Workflow

The project includes automated CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
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
    
    - name: Run backend tests
      run: npm test
    
    - name: Run frontend tests
      run: |
        cd web-app
        npm test
    
    - name: Run E2E tests
      run: |
        cd web-app
        npx playwright install
        npx playwright test
    
    - name: Run Pact contract tests
      run: npm run test:pact
```

### Pipeline Stages

1. **Install Dependencies** - Both backend and frontend
2. **Build Applications** - TypeScript compilation and Vite build
3. **Run Unit Tests** - Jest tests for backend logic
4. **Run Integration Tests** - API endpoint testing
5. **Run Contract Tests** - Pact consumer/provider verification
6. **Run E2E Tests** - Playwright tests with backend server
7. **Report Results** - Detailed test results and coverage

### Quality Gates

- All unit tests must pass
- All integration tests must pass
- All contract tests must pass
- All E2E tests must pass
- Code coverage thresholds met
- Linting passes without errors

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run all tests
npm run lint         # Run ESLint
```

### Frontend
```bash
cd web-app
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npx playwright test  # Run E2E tests
```

## 🎉 Sample Data

The API comes pre-seeded with three popular dog breeds:
- Golden Retriever
- German Shepherd
- Labrador Retriever

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the complete test suite
6. Submit a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure all tests pass before submitting
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License. 