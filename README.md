# Pluma Sphere Frontend

A modern, full-featured blog platform frontend built with Vue 3 and TypeScript. Pluma Sphere provides a comprehensive
blogging experience with user management, commenting system, and administrative features.

## 🚀 Features

### Core Functionality

- **Blog Management**: Create, edit, and delete blog posts with rich text editing
- **User Authentication**: Secure login system with JWT tokens
- **Comment System**: Hierarchical commenting with reply support
- **Tag System**: Organize posts with customizable tags
- **Like System**: Like posts and comments
- **Search**: Full-text search across all blog content
- **File Upload**: Support for image and file uploads

### User Management

- **User Profiles**: Customizable user profiles with avatars
- **User Dashboard**: Personal settings and content management
- **User Registration**: Complete user onboarding system

### Administrative Features

- **User Management**: Admin panel for managing users
- **Content Moderation**: Ban users and manage content
- **IP Banning**: IP-based access control
- **System Settings**: Configurable blog settings
- **Analytics**: User and content statistics

### Technical Features

- **Real-time Updates**: WebSocket integration for live updates
- **Responsive Design**: Mobile-first responsive UI
- **Dark Mode**: Theme switching support
- **Internationalization**: Multi-language support ready
- **Progressive Web App**: PWA capabilities

## 🛠️ Tech Stack

### Frontend Framework

- **Vue 3**: Latest Vue.js with Composition API
- **TypeScript**: Full type safety and better development experience
- **Vite**: Fast build tool and dev server

### UI & Styling

- **Element Plus**: Comprehensive Vue 3 UI component library
- **Vditor**: Feature-rich markdown editor
- **Vue Cropper**: Image cropping functionality
- **Unplugin Icons**: Automated icon imports

### State Management & Routing

- **Pinia**: Vue 3 state management
- **Vue Router**: Official routing solution

### HTTP & Real-time

- **Axios**: HTTP client for API communication
- **WebSocket**: Real-time communication support

### Development Tools

- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **ESLint**: Code linting with Vue and TypeScript support
- **Prettier**: Code formatting
- **Oxlint**: Additional linting for better code quality

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Clone the Repository

```bash
git clone https://github.com/your-username/pluma-sphere-frontend.git
cd pluma-sphere-frontend
```

### Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

## 🚀 Development

### Start Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Using pnpm
pnpm build

# Or using npm
npm run build
```

### Preview Production Build

```bash
# Using pnpm
pnpm preview

# Or using npm
npm run preview
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests once
pnpm test:unit

# Run tests in watch mode
pnpm test:unit:watch
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm test:e2e
```

### Run All Tests

```bash
pnpm test
```

## 🔧 Code Quality

### Linting

```bash
# Run ESLint
pnpm lint:eslint

# Run Oxlint
pnpm lint:oxlint

# Run all linters
pnpm lint
```

### Code Formatting

```bash
# Format code with Prettier
pnpm format
```

### Type Checking

```bash
# Type check with vue-tsc
pnpm type-check
```

## 📁 Project Structure

```
pluma-sphere-frontend/
├── src/
│   ├── api/              # API service modules
│   ├── components/       # Reusable Vue components
│   ├── stores/           # Pinia stores
│   ├── views/            # Page components
│   ├── router/           # Vue Router configuration
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   └── assets/           # Static assets
├── public/               # Public static files
├── e2e/                  # End-to-end tests
└── tests/                # Test utilities
```

## 🌐 API Integration

This frontend is designed to work with the Pluma Sphere backend API. Key API endpoints include:

- **Authentication**: `/api/v1/login`, `/api/v1/refresh-token`
- **Posts**: `/api/v1/post/*`
- **Users**: `/api/v1/user/*`
- **Comments**: `/api/v1/comment/*`
- **Admin**: `/api/v1/admin/*`
- **WebSocket**: `/ws`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
```

### Vite Configuration

The project uses Vite with the following key configurations:

- Auto-import for Vue and Vue Router
- Element Plus component auto-import
- Icon auto-import
- TypeScript path aliases (@/)

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Static Hosting

The built files in the `dist/` directory can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write unit tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/pluma-sphere-frontend/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- Element Plus team for the UI components
- All contributors who helped improve this project
