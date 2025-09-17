---
applyTo: "**"
---
# Default instructions


---
applyTo: "**/*.ts,**/*.tsx"
---
# UI Code Instructions
Always provide review comments in French
## Project Overview

This is a **Retrieval-Augmented Generation (RAG) Chat Application** that combines large language models with vector search capabilities. Users can upload documents (PDFs, web pages) and have intelligent conversations about the content. The application uses Couchbase for vector storage, OpenAI for embeddings and chat completions, and provides a modern chat interface built with Next.js.

**Key Purpose**: Enable semantic search through uploaded documents and provide contextually-aware AI responses based on document content, making it ideal for document analysis, knowledge management, and AI-powered research assistance.

## Architecture

The application follows a **full-stack TypeScript/JavaScript architecture** with clear separation between frontend and backend:

```
Frontend (Next.js) ↔ Backend (Express.js) ↔ Couchbase Database ↔ OpenAI API
```

### RAG Pipeline Flow
1. **Document Ingestion** → Content extraction → Text chunking → Embedding generation → Vector storage
2. **Query Processing** → Embedding generation → Vector similarity search → Context assembly → LLM response generation

## Folder Structure

- `/app`: Next.js App Router frontend with TypeScript
  - `/components`: Reusable React components (ChatMessage, FileUpload)
  - `globals.css`: Tailwind CSS styles and custom components
  - `layout.tsx`: Root layout with Inter font and metadata
  - `page.tsx`: Main chat interface with state management
  - `types.ts`: TypeScript type definitions
- `/server`: Express.js backend with Node.js
  - `/routes`: API endpoints for chat and file upload
  - `couchbase.js`: Database connection and vector operations
  - `server.js`: Express server setup with middleware
  - `.env`: Environment configuration (copy from env.example)
- Root configuration files: Next.js, Tailwind, TypeScript, package management

## Libraries and Frameworks

### Frontend Stack
- **Next.js 14** with App Router for React framework
- **TypeScript 5** for type safety and developer experience
- **Tailwind CSS 3.3.6** for utility-first styling with custom primary color palette
- **React 18** with hooks for modern component patterns
- **Lucide React** for consistent iconography
- **React Markdown** for rendering AI responses with formatting
- **React Dropzone** for intuitive file upload UX
- **Axios** for HTTP client communication

### Backend Stack
- **Node.js** with **Express.js 4.18.2** for REST API server
- **Couchbase 4.2.3** for NoSQL database with vector search capabilities
- **OpenAI 4.20.1** for embeddings (text-embedding-ada-002) and chat completions (GPT-3.5-turbo)
- **Multer** for multipart file upload handling with 10MB limit
- **PDF Parse** for extracting text content from PDF documents
- **Cheerio** for web scraping and HTML content extraction
- **Axios** for HTTP requests to external URLs
- **CORS** for cross-origin resource sharing
- **dotenv** for environment variable management

### Development Tools
- **ESLint** with Next.js configuration for code quality
- **Nodemon** for backend development server auto-restart
- **PostCSS** with Autoprefixer for CSS processing

## Coding Standards

### TypeScript Best Practices
- **Prefer types over interfaces** for all scenarios including primitives, unions, and object structures
- Use **strict type definitions** - avoid `any` type and `as` syntax
- Leverage **TypeScript inference** - don't create unnecessary type definitions
- Use **const assertions** over enums for better type safety and performance
- Define types in dedicated `types.ts` files for reusability

### React Component Patterns
- **Functional components with hooks** - no class components
- **Single Responsibility Principle** - each component does one thing well
- **Component-based architecture** with clear separation of concerns
- **Props are immutable** and passed top-down from parent to child
- **State management**: useState for local UI state, lift state up when needed
- **Custom hooks** for reusable logic and side effects
- **Error boundaries** for graceful error handling

### Code Organization
- **camelCase** for variables and functions
- **PascalCase** for components and types
- **kebab-case** for CSS classes and file names
- **Co-locate** related files (components, tests, styles) near each other
- **Separation of concerns**: presentation components vs. container components
- **Custom hooks** in dedicated files following `use-*` naming convention

### API and Backend Patterns
- **RESTful API design** with appropriate HTTP status codes
- **Express middleware** for error handling, CORS, and file uploads
- **Environment-based configuration** using .env files
- **Graceful error handling** with try-catch and meaningful error messages
- **Database operations** abstracted in dedicated modules
- **Vector operations** encapsulated in couchbase.js for reusability

## Key Technical Concepts

### RAG Implementation
- **Vector Embeddings**: Using OpenAI's text-embedding-ada-002 (1536 dimensions)
- **Similarity Search**: Cosine similarity with configurable K-nearest neighbors
- **Context Assembly**: Combining query with retrieved documents for LLM prompts
- **Fallback Mechanisms**: Text search when vector search is unavailable

### State Management
- **Local state** (useState) for UI components and form data
- **Props drilling** for simple data flow, Context API for complex shared state
- **Derived state** computed from existing state using re-renders
- **Server state** managed through direct API calls (consider React Query for larger apps)

### Performance Considerations
- **React.memo** for preventing unnecessary re-renders
- **Lazy loading** potential for route-based code splitting
- **File upload limits** (10MB) to prevent server overload
- **Database connection pooling** through Couchbase SDK
- **Error boundaries** to prevent full application crashes

### Security Best Practices
- **Input validation** on both frontend and backend
- **File type restrictions** (PDF only for file uploads)
- **Environment variable protection** for API keys and database credentials
- **CORS configuration** for controlled cross-origin access
- **Error message sanitization** to avoid information leakage

## Environment Setup

### Required Environment Variables
```env
# Couchbase Configuration
COUCHBASE_CONNECTION_STRING=couchbase://localhost
COUCHBASE_USERNAME=Administrator
COUCHBASE_PASSWORD=your_password
COUCHBASE_BUCKET_NAME=travel-sample

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Development Workflow
1. **Backend first**: Start with `cd server && npm run dev`
2. **Frontend second**: Run `npm run dev` in root directory
3. **Testing**: Use `node test-setup.js` for environment verification
4. **API Testing**: Backend runs on port 5000, frontend on port 3000

## UI Guidelines

### Design System
- **Primary color palette**: Blue-based with 50/500/600/700 variants
- **Typography**: Inter font family for clean, modern appearance
- **Responsive design**: Mobile-first approach with Tailwind responsive utilities
- **Component library**: Custom Tailwind components for consistency

### Chat Interface Patterns
- **Message bubbles**: Distinct styling for user (blue) vs assistant (gray) messages
- **Auto-scroll**: Smooth scrolling to latest messages using useRef
- **Loading states**: Spinner and "Thinking..." indicator during API calls
- **File upload**: Modal-style interface with drag-and-drop visual cues
- **Error handling**: Inline error messages with appropriate color coding

### Accessibility Considerations
- **Semantic HTML** with proper heading hierarchy
- **Keyboard navigation** support for all interactive elements
- **Focus management** with visible focus indicators
- **Screen reader support** through ARIA labels and roles
- **Color contrast** meeting WCAG guidelines

## Common Patterns and Anti-Patterns

### ✅ Recommended Patterns
- Use **async/await** for promise handling instead of .then() chains
- Implement **error boundaries** for critical UI sections
- **Extract reusable logic** into custom hooks
- **Validate props** with TypeScript interfaces
- **Clean up side effects** in useEffect cleanup functions
- **Centralize API calls** in dedicated service functions

### ❌ Anti-Patterns to Avoid
- Don't call components as functions - use JSX syntax
- Avoid **excessive prop drilling** - use Context API when needed
- Don't use **useEffect for synchronous effects** - use event handlers
- Avoid **storing derived state** - compute values during render
- Don't **ignore error handling** - always handle API call failures
- Avoid **hard-coded values** - use environment variables and constants

## Testing Strategy

### Unit Testing Focus
- **Components**: Test behavior over implementation details
- **Hooks**: Test custom hooks with React Testing Library
- **Utilities**: Test pure functions and helper methods
- **API endpoints**: Test with mock data and error scenarios

### Integration Testing
- **RAG pipeline**: End-to-end document upload and chat flow
- **Database operations**: Test vector search and fallback mechanisms
- **File processing**: PDF parsing and web scraping functionality

## Debugging and Troubleshooting

### Common Issues
- **Couchbase connection**: Verify server running on localhost:8091
- **Vector search index**: Check index existence in Couchbase UI
- **OpenAI API**: Validate API key and billing status
- **CORS errors**: Ensure proper proxy configuration in next.config.js
- **File upload**: Check multer configuration and file size limits

### Development Tools
- **Browser DevTools**: Network tab for API call debugging
- **Server logs**: Console output for backend error tracking
- **Couchbase UI**: Query workbench for database inspection
- **Test script**: Run `node test-setup.js` for system verification

## Performance Optimization

### Frontend Optimizations
- **Component memoization** with React.memo for expensive renders
- **Virtual scrolling** for large message histories (consider @tanstack/react-virtual)
- **Image optimization** using Next.js Image component when applicable
- **Bundle analysis** to identify large dependencies

### Backend Optimizations
- **Connection pooling** through Couchbase SDK configuration
- **Query optimization** for vector and text search operations
- **Caching strategies** for frequently accessed documents
- **Rate limiting** for API endpoints to prevent abuse

This RAG application demonstrates modern full-stack development with AI integration, focusing on type safety, component reusability, and scalable architecture patterns.