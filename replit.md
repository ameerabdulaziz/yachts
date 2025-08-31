# Overview

Yachtak (operated by Nauttec) is a comprehensive fractional yacht ownership and rental platform. It aims to revolutionize luxury boating access by enabling Visitors, Owners, and Administrators to interact with the De Antonio Yachts range (D23-D60) under various fractional ownership structures. Key capabilities include sophisticated booking rules, fuel wallet management, and peer-to-peer share trading.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Django Backend Git Repository (August 31, 2025)
- Successfully initialized Git repository in `django_backend/` directory
- Created comprehensive Postman collection with 40+ endpoints organized by Django apps
- Fixed URL routing issues for authentication endpoints
- All API endpoints now functional and ready for testing
- Complete environment configuration for development and production use

# System Architecture

## Frontend

The frontend is built with React 18 and TypeScript, using shadcn/ui (Radix UI) for components, Tailwind CSS for styling (ocean-themed palette with primary blue #2563eb), Wouter for routing, React Query for server state management, and React Hook Form with Zod for form handling. It features a mobile-first, responsive design with bottom navigation.

## Backend

The system has a dual backend architecture:

### Django REST API Backend (Primary)
Located in `django_backend/` directory, this is the main production backend:
- Django 4.2.7 with REST Framework for API development
- Phone-based authentication with OTP verification
- 7 Django apps: accounts, boats, bookings, ownership, payment_system, inquiries, notify_system
- 34 REST API endpoints with comprehensive Postman documentation
- Stripe payment integration and health monitoring endpoints
- SQLite for development, PostgreSQL ready for production

### Node.js/Express Backend (Development)
- Express.js with TypeScript for development tooling
- Drizzle ORM integration for schema management
- Vite development server with hot module replacement

## Database

The PostgreSQL database supports core entities: Users (Visitors, Owners, Administrators), Yachts (De Antonio range with specs, calendars, maintenance), Fractional Ownership (share structures, usage limits, co-owner relations), a Booking Rules Engine (seasonal multipliers, weighted days), Share Trading (right of first refusal, waitlists, peer-to-peer marketplace), and a Fuel Wallet System (prepaid virtual fuel, tracking).

## Authentication & Authorization

The system employs a dual authentication flow: password login (primary, via phone number) and an OTP fallback (SMS verification). Account setup includes role selection and password creation. Session management uses PostgreSQL-backed storage. Role-based access controls UI and functionality, with smart routing redirecting users to relevant dashboards post-login (e.g., owners to /my-boats, renters to /charter). Mobile PWA routing is comprehensively handled.

## Data Management

The architecture emphasizes type safety across the stack using TypeScript, Zod for validation, and React Query for intelligent caching and background updates. It is prepared for real-time features.

## UI/UX

The design includes a custom ocean-themed color palette, uses shadcn/ui for consistent components, and is optimized for mobile devices with a focus on intuitive navigation. It incorporates iOS-native styling and SF Pro fonts for an enhanced user experience.

# External Dependencies

## Core Technologies

- **@neondatabase/serverless**: For serverless PostgreSQL connections with Drizzle ORM.
- **Drizzle ORM**: Type-safe database operations for PostgreSQL.
- **React Query**: Server state management and data synchronization.
- **Wouter**: Lightweight client-side routing.

## UI & Styling

- **@radix-ui/***: Accessible UI primitives.
- **shadcn/ui**: Component library built on Radix UI.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.

## Development & Build Tools

- **Vite**: Build tool and development server.
- **TypeScript**: Static type checking.
- **ESBuild**: Fast bundling.
- **PostCSS**: CSS processing.

## Third-Party Integrations (Planned/Pending)

- **SMS/OTP Service**: For phone-based authentication.
- **Payment Processing**: For credit card and digital wallet transactions.
- **Image Storage**: For yacht and user images.
- **Real-time Messaging**: For instant communication.

## Deployment & Infrastructure

- **Replit Environment**: Configured for Replit deployment.
- **PostgreSQL Database**: Hosted database service.
- **Session Storage**: PostgreSQL-backed session management using `connect-pg-simple`.
- **Environment Configuration**: Uses environment variables for sensitive data.