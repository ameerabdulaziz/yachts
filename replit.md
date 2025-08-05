# Overview

Yachtak (operated by Nauttec) is a comprehensive fractional yacht ownership and rental platform that revolutionizes luxury boating access. The platform enables three user types: Visitors (prospective customers), Owners (fractional yacht co-owners), and Administrators (Nauttec team). It offers the complete De Antonio Yachts range (D23-D60) under various fractional ownership structures, with sophisticated booking rules, fuel wallet management, and peer-to-peer share trading capabilities.

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

The application uses a PostgreSQL database with the following core entities based on Yachtak's three-tier user system:

- **Users**: Three types - Visitors (prospective customers), Owners (fractional co-owners), Administrators (Nauttec team)
- **Yachts**: Complete De Antonio range (D23-D60) with specifications, availability calendars, and maintenance logs
- **Fractional Ownership**: Share structures, usage limits (48 days/50 engine hours per share), and co-owner relationships
- **Booking Rules Engine**: Seasonal multipliers, weighted days, peer interactions, and owner ratings
- **Share Trading**: Right of first refusal system, waitlists, and peer-to-peer marketplace
- **Fuel Wallet System**: Prepaid virtual fuel management with usage tracking and top-up notifications

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

## August 2025
- **August 5, 2025**: Major Yachtak specification implementation:
  - Updated platform overview to reflect three-tier user system (Visitors, Owners, Administrators)
  - Implemented sophisticated booking rules engine with 48-day/50-engine-hour limits per share
  - Added booking calendar with seasonal multipliers and weighted days for high-demand periods
  - Created share trading marketplace with 30-day right of first refusal system
  - Enhanced My Boats functionality with fractional ownership management
  - Added peer-to-peer share trading and day swapping capabilities
  - Integrated fuel wallet system with usage tracking and low-balance notifications

## January 2025
- **January 19, 2025**: Comprehensive De Antonio Yachts data update with authentic specifications:
  - Updated all yacht specifications with official dimensions from De Antonio Yachts website
  - D60: 18.50m length, 12 passengers, 3 cabins (flagship model for 2025)
  - D42: 12.64m length, 12 passengers, 2 cabins with 1200HP max power
  - D36: 11.50m length, 12 passengers, 1 cabin (corrected from 10.30m)
  - D32: 9.90m length, 10 passengers, 2 cabins with 600HP max power
  - D29: 8.50m length, 8 passengers, 1 cabin (corrected dimensions)
  - E23: 7.20m length, 8 passengers, electric catamaran with zero emissions
  - All locations standardized to "El Gouna, Egypt" for consistency
  - All dates updated to be after September 15th, 2024
- Updated yacht ownership detail page with iOS 18 styling and compact layouts
- Splash screen logo repositioning with Nauttec logo after boat tip
- Initial comprehensive yacht booking platform implementation with 31 screens
- Integrated PostgreSQL database with Drizzle ORM
- Implemented authentication flow and fractional ownership system
- Mobile-first responsive design with ocean blue theme