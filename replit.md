# Overview

Nauttec is a comprehensive luxury yacht booking mobile application that provides users with the ability to browse, book, and own yacht shares. The application features a modern React-based frontend with a Node.js/Express backend, designed with a mobile-first approach and nautical luxury theming. It supports both yacht renters and owners, offering features like yacht booking, fractional ownership opportunities, fuel wallet management, and comprehensive user management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React 18 with TypeScript and follows a component-based architecture:

- **UI Framework**: Uses shadcn/ui component library with Radix UI primitives for consistent, accessible components
- **Styling**: Tailwind CSS with custom ocean-themed color palette (primary blue #2563eb) and CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing across 31+ screens
- **State Management**: React Query (TanStack Query) for server state management and data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Mobile-First Design**: Responsive design optimized for mobile devices with bottom navigation

## Backend Architecture

The backend follows a RESTful API design pattern:

- **Framework**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM with schema-first approach for type-safe database operations
- **API Structure**: Modular route handlers in `/server/routes.ts` with centralized storage abstraction
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development Tools**: Vite integration for hot module replacement in development

## Database Schema Design

The application uses a PostgreSQL database with the following core entities:

- **Users**: Handles authentication, profile data, roles (renter/owner/both), and fuel wallet balances
- **Yachts**: Yacht listings with detailed specifications, amenities, pricing, and location data
- **Bookings**: Reservation management with guest details, pricing, add-ons, and payment methods
- **Ownership System**: Fractional ownership opportunities, share purchases, and secondary market listings
- **Communication**: Messages system for guest-owner communication
- **Financial**: Fuel wallet transactions for virtual currency management

## Authentication & Authorization

The system implements a phone-based authentication flow:

- **Phone Login**: Country code selector with SMS OTP verification
- **Account Setup**: Role selection (renter, owner, or both) during onboarding
- **Session Management**: Uses PostgreSQL-backed session storage with express-session
- **Role-Based Access**: Different UI and functionality based on user roles

## Data Management Strategy

- **Type Safety**: Comprehensive TypeScript coverage from database schema to frontend components
- **Validation**: Zod schemas for runtime type validation and form handling
- **Caching**: React Query provides intelligent caching and background updates
- **Real-time Features**: Prepared for real-time messaging and booking updates

# External Dependencies

## Core Technologies

- **@neondatabase/serverless**: Serverless PostgreSQL connection handling for the Drizzle ORM
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **React Query**: Server state management and data synchronization
- **Wouter**: Lightweight routing solution for single-page application navigation

## UI & Styling

- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

## Development & Build Tools

- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Third-Party Integrations

- **SMS/OTP Service**: Phone-based authentication (implementation pending)
- **Payment Processing**: Credit card and digital wallet payment handling (implementation pending)
- **Image Storage**: Yacht and user image hosting service (implementation pending)
- **Real-time Messaging**: WebSocket or similar service for instant messaging (implementation pending)

## Deployment & Infrastructure

- **Replit Environment**: Configured for Replit deployment with development banner
- **PostgreSQL Database**: Hosted database service with connection pooling
- **Session Storage**: PostgreSQL-backed session management with connect-pg-simple
- **Environment Configuration**: Environment variables for database connections and API keys

# Recent Changes

## January 2025
- **January 19, 2025**: Updated all yacht and boat listings to feature authentic De Antonio Yachts models including D50 Open, D42 Open, D36 Open, D32 Open, D29 Open, D60 Open, D50 Coupe, and E23 electric model with real specifications, authentic pricing, and official images from Barcelona-based manufacturer
- Initial comprehensive yacht booking platform implementation with 31 screens
- Integrated PostgreSQL database with Drizzle ORM
- Implemented authentication flow and fractional ownership system
- Mobile-first responsive design with ocean blue theme