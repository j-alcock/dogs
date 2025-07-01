# Dog Breeds System

A complete, full-stack web application for managing dog breeds, featuring a TypeScript/Express.js backend API and a modern React frontend with comprehensive testing and CI/CD pipeline.

## 🎯 **Project Overview**

This is a production-ready dog breeds management system with:

- **Backend API** (Port 3000): TypeScript Express.js REST API with SQLite database
- **Frontend Web App** (Port 3001): Modern React 18 application with Tailwind CSS
- **Contract Testing**: Pact integration for API compatibility
- **E2E Testing**: Playwright tests for full user workflows
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Comprehensive Documentation**: Complete API and system documentation

## 🚀 **Quick Start**

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd dogs
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd web-app
   npm install
   cd ..
   ```

4. **Start the complete system:**
   ```bash
   # Terminal 1: Start backend API
   npm run dev
   
   # Terminal 2: Start frontend web app
   cd web-app
   npm run dev
   ```

5. **Access the application:**
   - **Web App**: http://localhost:3001
   - **API Documentation**: http://localhost:3000
   - **Health Check**: http://localhost:3000/health

## 🏗️ **System Architecture**

```
dogs/
├── src/                    # Backend API (Port 3000)
│   ├── controllers/       # Request handlers
│   ├── database/         # SQLite database service
│   ├── routes/           # API endpoints
│   ├── types/            # TypeScript interfaces
│   ├── pact/             # Contract testing
│   └── index.ts          # Express server
├── web-app/              # Frontend (Port 3001)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API integration
│   │   ├── types/        # Shared types
│   │   ├── test/         # Playwright E2E tests
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── .github/workflows/    # CI/CD pipeline
├── package.json          # Backend dependencies
└── README.md            # Complete documentation
```

## 🎨 **Features**

### **Backend API Features**
- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete dog breeds
- ✅ **Search Functionality** - Search breeds by name, breed group, or temperament
- ✅ **Pagination** - Efficient pagination for large datasets
- ✅ **Input Validation** - Comprehensive validation using express-validator
- ✅ **Error Handling** - Consistent error responses with proper HTTP status codes
- ✅ **SQLite Database** - Lightweight, file-based database with automatic seeding
- ✅ **Security** - Helmet.js for security headers, CORS support
- ✅ **TypeScript** - Full type safety and IntelliSense support
- ✅ **Testing** - Jest-based unit and integration tests
- ✅ **Contract Testing** - Pact integration for API compatibility

### **Frontend Web App Features**
- ✅ **Modern UI** - Beautiful, responsive interface with Tailwind CSS
- ✅ **Breed Management** - View, create, edit, delete breeds with intuitive forms
- ✅ **Real-time Search** - Instant search functionality with debouncing
- ✅ **Pagination** - Smooth pagination with navigation controls
- ✅ **Responsive Design** - Mobile-first approach, works on all devices
- ✅ **Loading States** - Smooth loading indicators and skeleton screens
- ✅ **Error Handling** - User-friendly error messages and validation
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **E2E Testing** - Playwright tests for complete user workflows

### **Testing & Quality Assurance**
- ✅ **Unit Tests** - Jest-based tests for backend logic
- ✅ **Integration Tests** - API endpoint testing with Supertest
- ✅ **Contract Tests** - Pact consumer/provider testing
- ✅ **E2E Tests** - Playwright tests for complete user workflows
- ✅ **CI/CD Pipeline** - GitHub Actions for automated testing
- ✅ **Code Quality** - ESLint and Prettier for consistent code style

## 📊 **API Endpoints**

### Base URL
```
http://localhost:3000/api/breeds
```

### Core Endpoints

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
| `POST` | `/_pactSetup` | Pact provider state management |

## 🧪 **Testing**

### Running Tests

```bash
# Backend tests
npm test                    # Run all backend tests
npm run test:unit          # Run unit tests only
npm run test:pact          # Run Pact contract tests

# Frontend tests
cd web-app
npm test                   # Run Jest tests
npx playwright test        # Run E2E tests
npx playwright test --ui   # Run E2E tests with UI
```

### Test Coverage

- **Backend**: Unit tests, integration tests, Pact contract tests
- **Frontend**: Component tests, API integration tests, Playwright E2E tests
- **CI/CD**: Automated testing on every push and pull request

## 🔄 **CI/CD Pipeline**

The project includes a comprehensive GitHub Actions workflow that:

1. **Installs Dependencies** - Both backend and frontend
2. **Builds Applications** - TypeScript compilation and Vite build
3. **Runs Unit Tests** - Jest tests for backend logic
4. **Runs Contract Tests** - Pact consumer/provider verification
5. **Runs E2E Tests** - Playwright tests with backend server
6. **Reports Results** - Detailed test results and coverage

### Workflow Triggers
- Push to main branch
- Pull requests to main branch

## 📱 **User Interface**

### **Main Features**
1. **Breed List** - Grid layout with pagination and search
2. **Breed Detail** - Comprehensive breed information display
3. **Breed Form** - Create and edit breeds with validation
4. **Search** - Real-time search with instant results
5. **Navigation** - Clean, intuitive navigation with React Router

### **Design Highlights**
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive**: Mobile-first approach, works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Fast loading with Vite and optimized builds
- **User Experience**: Intuitive interactions with proper feedback

## 🔧 **Development**

### Available Scripts

#### Backend (dogs/)
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm test             # Run all tests
npm run test:unit    # Run unit tests only
npm run test:pact    # Run Pact contract tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

#### Frontend (web-app/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run Jest tests
npx playwright test  # Run E2E tests
npm run lint         # Run ESLint
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend server port |
| `HOST` | `localhost` | Backend server host |
| `NODE_ENV` | `development` | Environment mode |

## 📚 **Documentation**

- **[API Documentation](API_SUMMARY.md)** - Complete API reference
- **[Web App Documentation](WEB_APP_SUMMARY.md)** - Frontend system overview
- **[Pact Testing Guide](PACT_TESTING.md)** - Contract testing setup and usage
- **[Demo System](demo-system.sh)** - Complete system demonstration script

## 🚀 **Deployment**

### Local Development
```bash
# Start both services
npm run dev          # Backend on port 3000
cd web-app && npm run dev  # Frontend on port 3001
```

### Production Build
```bash
# Build backend
npm run build
npm start

# Build frontend
cd web-app
npm run build
npm run preview
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the complete test suite
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure all tests pass before submitting
- Update documentation as needed
- Follow the existing code style

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Sample Data**

The API comes pre-seeded with three popular dog breeds:
- Golden Retriever
- German Shepherd
- Labrador Retriever

You can start using the system immediately without adding any data!

## 🔗 **Quick Links**

- **Live Demo**: [Web Application](http://localhost:3001)
- **API Docs**: [Backend API](http://localhost:3000)
- **Health Check**: [API Status](http://localhost:3000/health)
- **Pact Broker**: [Contract Testing](http://localhost:9292) (when running)

---

**Built with ❤️ using TypeScript, React, Express, and modern web technologies** 