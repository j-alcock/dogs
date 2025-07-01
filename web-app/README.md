# Dog Breeds Web Application

A modern React web application for managing dog breeds, built with TypeScript, Tailwind CSS, and Vite.

## Features

- 🐕 **Browse Breeds** - View all dog breeds with pagination
- 🔍 **Search Breeds** - Search by name, breed group, or temperament
- ➕ **Add Breeds** - Create new dog breeds with comprehensive forms
- ✏️ **Edit Breeds** - Update existing breed information
- 🗑️ **Delete Breeds** - Remove breeds with confirmation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite for optimal development experience

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icons

## Prerequisites

- Node.js (v16 or higher)
- The Dog Breeds API running on `http://localhost:3000`

## Installation

1. **Navigate to the web app directory:**
   ```bash
   cd web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3001
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── BreedList.tsx   # List all breeds
│   ├── BreedDetail.tsx # Individual breed view
│   ├── BreedForm.tsx   # Create/edit breed form
│   ├── BreedCard.tsx   # Breed card component
│   ├── SearchBreeds.tsx # Search functionality
│   └── LoadingSpinner.tsx # Loading indicator
├── services/           # API services
│   └── api.ts         # API client and methods
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types
├── utils/             # Utility functions
│   └── cn.ts         # CSS class utilities
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## API Integration

The web app communicates with the Dog Breeds API through:

- **Base URL**: `http://localhost:3000/api` (proxied through Vite)
- **Endpoints**: All CRUD operations for breeds
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Loading indicators for better UX

## Features in Detail

### Breed List
- Grid layout with responsive design
- Pagination support
- Search functionality
- Quick actions (view, edit, delete)

### Breed Detail
- Full breed information display
- Image handling with fallbacks
- Characteristic breakdown
- Temperament tags
- Edit and delete actions

### Breed Form
- Comprehensive form validation
- Real-time validation feedback
- Support for both create and edit modes
- Image URL input
- Responsive form layout

### Search
- Real-time search functionality
- Search across multiple fields
- Results display with breed cards
- Empty state handling

## Styling

The application uses Tailwind CSS with:

- **Custom Color Palette** - Primary blue theme
- **Responsive Design** - Mobile-first approach
- **Component Classes** - Reusable button and input styles
- **Animations** - Smooth transitions and loading states
- **Dark Mode Ready** - Easy to extend for dark theme

## Development

### Adding New Features

1. **Create new components** in `src/components/`
2. **Add types** in `src/types/index.ts`
3. **Update API service** in `src/services/api.ts`
4. **Add routes** in `src/App.tsx`

### Styling Guidelines

- Use Tailwind utility classes
- Follow the established color palette
- Maintain responsive design
- Use the `cn()` utility for conditional classes

### API Integration

- All API calls go through `src/services/api.ts`
- Use the `breedsApi` object for breed operations
- Handle loading and error states consistently
- Provide user feedback for all actions

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Variables

The app is configured to proxy API requests to `http://localhost:3000` during development. For production, update the API base URL in `src/services/api.ts`.

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on different screen sizes
5. Follow the established naming conventions

## License

MIT License - see LICENSE file for details. 