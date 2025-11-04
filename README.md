# TaskOPedia

Enterprise-grade task and project management microservices architecture, built using NestJS, Prisma, and Turborepo.

📋 **[View Feature Roadmap](ROADMAP.md)** - Track upcoming features and implementation progress

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

### Environment Setup

Copy the example environment file and update values:

```bash
# Copy .env.example to .env
cp .env.example .env
```

Then update the `.env` file with your database credentials and other settings.

### Development

```bash
# Run all services
pnpm run dev:all

# Run individual services
pnpm run dev:api      # API on port 4000
pnpm run dev:gateway  # Gateway on port 3000
pnpm run dev:logger   # Logger on port 4001
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
taskopedia/
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

## 🔐 Authentication

JWT-based authentication system with the following endpoints:

**Public Endpoints:**
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - Login (returns JWT token)
- `POST /api/user/verify-otp` - Verify account with OTP
- `POST /api/user/resend-otp` - Resend OTP
- `POST /api/user/reset-password` - Reset password

**Protected Endpoints** (require `Authorization: Bearer <token>` header):
- User CRUD operations
- Project management (create, update, archive, delete)
- Task management (create, update, archive, delete)
- Dashboard statistics

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
- **Database:** Prisma ORM (MySQL)
- **Authentication:** JWT (jsonwebtoken)
- **Logging:** Winston
- **Build Tool:** Turborepo
- **Package Manager:** pnpm

## 📝 License

ISC

