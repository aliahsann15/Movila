# Movila Backend API

Express.js + TypeScript backend for the Movila application.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers (TypeScript)
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/               # Compiled JavaScript (generated)
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript knowledge

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Build TypeScript to JavaScript:
```bash
npm run build
```

Production mode (run compiled code):
```bash
npm start
```

Production mode:
```bash
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Example API
```
GET    /api/example      # Get all items
GET    /api/example/:id  # Get item by ID
POST   /api/example      # Create new item
PUT    /api/example/:id  # Update item
DELETE /api/example/:id  # Delete item
```

## 🏗️ Architecture

### TypeScript Features
- **Strict type checking**: Catch errors at compile time
- **Type definitions**: Full IntelliSense support
- **Interfaces**: Clear data structure contracts
- **Enhanced IDE support**: Better autocomplete and refactoring

### Middleware Stack
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logging
- **compression**: Response compression
- **express-validator**: Request validation

### Error Handling
Centralized error handling with detailed error messages in development mode.

### Validation
Request validation using express-validator with custom validation rules.

## 🔧 Configuration

Edit `src/config/index.ts` to customize:
- Port settings
- Database connections
- API configurations

## 📝 Adding New Features

### 1. Create a Route
Create a new file in `src/routes/`:
```typescript
import { Router } from 'express';
import * as controller from '../controllers/your.controller';

const router = Router();

router.get('/', controller.getAll);
// Add more routes...

export default router;
```

### 2. Create a Controller
Create a new file in `src/controllers/`:
```typescript
import { Request, Response, NextFunction } from 'express';

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Your logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};
```

### 3. Register Route
Add to `src/routes/index.ts`:
```typescript
import yourRoutes from './your.routes';
router.use('/your-path', yourRoutes);
```

## 🛡️ Security

- Helmet for security headers
- CORS configuration
- Input validation with TypeScript types
- Error sanitization in production

## 📦 Available Scripts

- `npm start` - Start production server (compiled)
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch mode for compilation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Build and test TypeScript code
4. Submit a pull request

## 📄 License

ISC
