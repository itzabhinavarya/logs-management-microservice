# Logs Management Microservice

Enterprise-grade microservices architecture with centralized logging, built using NestJS, Prisma, and Turborepo.

## 🏗️ Architecture

This monorepo contains three microservices:

- **API Service** - Core business logic with Prisma ORM and database management
- **Gateway Service** - API Gateway with request routing and proxy middleware
- **Logger Service** - Centralized logging service using Winston

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run db:generate
```

### Development

```bash
# Run all services
pnpm run dev:all

# Run individual services
pnpm run dev:api      # API on port 3001
pnpm run dev:gateway  # Gateway on port 3000
pnpm run dev:logger   # Logger on port 3002
```

### Build & Production

```bash
# Build all services
pnpm run build

# Build specific service
pnpm run build:api

# Start in production
pnpm run start:all
```

## 📦 Project Structure

```
logs-management-microservice/
├── apps/
│   ├── api/          # API service with Prisma
│   ├── gateway/      # API Gateway
│   └── logger/       # Centralized logging
├── packages/         # Shared packages
│   ├── common/
│   ├── config/
│   ├── contracts/
│   └── types/
└── infra/           # Infrastructure configs
```

## 🗄️ Database Commands

```bash
pnpm run db:migrate   # Run migrations
pnpm run db:push      # Push schema changes
pnpm run db:studio    # Open Prisma Studio
pnpm run db:reset     # Reset database
```

## 🧪 Testing & Quality

```bash
pnpm run test         # Run tests
pnpm run test:cov     # Test coverage
pnpm run lint         # Lint code
pnpm run format       # Format code
```

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** Prisma ORM
- **Logging:** Winston
- **Build Tool:** Turborepo
- **Package Manager:** pnpm

## 📝 License

ISC

