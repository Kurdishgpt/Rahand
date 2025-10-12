# AI Chatbot - Kurdish & English Voice Assistant

## Overview

A bilingual AI chatbot application supporting Kurdish Central (Sorani) and English with advanced voice interaction and image generation capabilities. The application features a modern, clean interface inspired by Linear, ChatGPT, and Gemini, with a blue theme optimized for clarity and speed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing

**UI Component System**
- **Shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **CSS Variables** for dynamic theming (light/dark modes)
- Custom blue color palette with HSL color system for theme consistency

**State Management**
- **React Context API** for global state (Theme, Language)
- **TanStack Query (React Query)** for server state management and caching
- **React Hook Form** with Zod validation for form handling

**Key Features**
- **Bilingual Support**: Seamless English-Kurdish switching with RTL text support
- **Voice Interaction**: Web Speech API integration for speech recognition and text-to-speech
- **Real-time Streaming**: Server-sent events (SSE) for streaming AI responses
- **Image Generation**: DALL-E 3 integration for AI image creation
- **Responsive Design**: Mobile-first approach with adaptive layouts

**Design System**
- Blue theme with primary color HSL(217 91% 60%)
- Dark mode as primary with navy-blue backgrounds
- Custom border radius system (9px/6px/3px)
- Elevation system using rgba overlays for hover/active states

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for API server
- **HTTP streaming** for real-time chat completions
- Middleware for request logging and error handling

**API Structure**
- RESTful endpoints under `/api` prefix
- Streaming chat endpoint (`/api/chat`) with SSE
- Image generation endpoint for DALL-E integration
- Language-aware system messages for Kurdish/English responses

**Development Features**
- Vite middleware integration in development mode
- Hot module replacement (HMR) support
- Production static file serving

### Data Storage

**Database Strategy**
- **Drizzle ORM** configured for PostgreSQL (schema-first approach)
- **Neon Database** serverless PostgreSQL integration via `@neondatabase/serverless`
- In-memory storage fallback (`MemStorage`) for development/testing

**Schema Design**
- User authentication schema with UUID primary keys
- Drizzle-Zod integration for runtime validation
- Migration support via `drizzle-kit`

**Current Implementation**
- Memory-based storage for rapid prototyping
- Database schema defined but not actively used (ready for production migration)

### External Dependencies

**AI Services**
- **OpenAI API**
  - GPT-5 model for chat completions with 8192 token limit
  - DALL-E 3 for 1024x1024 image generation
  - Streaming API support for real-time responses

**Voice Technologies**
- **Web Speech API** (browser-native)
  - Speech Recognition: Kurdish (ku-IQ) and English (en-US) language codes
  - Speech Synthesis: Fallback to Arabic (ar-SA) for Kurdish TTS
  - Client-side processing, no external service required

**UI Component Libraries**
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide React**: Icon library
- **Embla Carousel**: Touch-friendly carousel component
- **CMDK**: Command palette component

**Utilities**
- **class-variance-authority**: Type-safe variant management
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation

**Development Tools**
- **Replit Plugins**: Runtime error modal, cartographer, dev banner
- **TSX**: TypeScript execution for development server
- **ESBuild**: Production bundling

**Session Management**
- **express-session** with PostgreSQL store (`connect-pg-simple`) configured but not actively implemented