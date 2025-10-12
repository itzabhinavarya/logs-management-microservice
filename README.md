# Enterprise Microservice Architecture

> A scalable, production-ready microservices architecture built with NestJS, featuring API Gateway pattern, centralized logging, and Prisma ORM integration.

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services Overview](#services-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Logging System](#logging-system)
- [Development Workflow](#development-workflow)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This is an enterprise-grade microservices architecture that demonstrates best practices for building scalable, maintainable distributed systems. The project implements a monorepo structure using PNPM workspaces, featuring three core services that work together to provide a complete user management system with centralized logging and API gateway routing.

### Key Features

- ✨ **Microservices Architecture**: Independently deployable services with clear separation of concerns
- 🔐 **API Gateway Pattern**: Single entry point for all client requests with request proxying
- 📊 **Centralized Logging**: Dedicated logging microservice using Winston for structured logging
- 🗃️ **Database Integration**: Prisma ORM with MySQL for type-safe database operations
- 🏗️ **Monorepo Structure**: Efficient code sharing and dependency management with PNPM workspaces
- 🚀 **Hot Reload**: Development mode with automatic service restart on file changes
- 🔄 **RESTful API**: Complete CRUD operations with standardized response format

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   GATEWAY SERVICE      │
            │   (Port: 3000)         │
            │   - API Routing        │
            │   - Request Proxy      │
            └────────┬───────────────┘
                     │
                     ▼
            ┌────────────────────────┐
            │    API SERVICE         │
            │    (Port: 4000)        │◄──────────────┐
            │    - User CRUD         │               │
            │    - Business Logic    │               │
            │    - Prisma ORM        │               │
            └────┬──────────┬────────┘               │
                 │          │                        │
                 │          │                        │
                 ▼          ▼                        │
         ┌──────────┐  ┌──────────────────┐        │
         │  MySQL   │  │  LOGGER SERVICE   │        │
         │ Database │  │  (Port: 4001)     │◄───────┘
         │          │  │  - Winston Logger │
         │          │  │  - File Storage   │
         └──────────┘  │  - Log Aggregation│
                       └───────────────────┘
```

### Architecture Patterns

1. **API Gateway Pattern**: Gateway service acts as a single entry point, routing requests to appropriate microservices
2. **Database per Service**: API service has its own MySQL database managed via Prisma
3. **Centralized Logging**: Logger service collects logs from all services for monitoring and debugging
4. **Service Communication**: HTTP-based communication between services (easily extensible to gRPC or message queues)

---

## Tech Stack

### Core Technologies

- **Runtime**: Node.js (v18+)
- **Framework**: NestJS (v11.x)
- **Language**: TypeScript (v5.7+)
- **Package Manager**: PNPM (v10.18.1)

### Databases & ORM

- **Database**: MySQL
- **ORM**: Prisma (v6.17.0)
- **Database Client**: @prisma/client

### Libraries & Tools

- **HTTP Client**: Axios (v1.12.2)
- **Proxy Middleware**: http-proxy-middleware (v3.0.5)
- **Logger**: Winston (v3.18.3)
- **Validation**: class-validator, class-transformer
- **Process Manager**: Concurrently (for running multiple services)

### Development Tools

- **Linter**: ESLint (v9.x)
- **Testing**: Jest (v30.x)
- **Build Tool**: TypeScript Compiler, NestJS CLI

---

## Project Structure

```
enterprise-microservice/
├── apps/                           # Microservices applications
│   ├── api/                        # Main API Service (Port: 4000)
│   │   ├── dist/                   # Compiled JavaScript output
│   │   ├── prisma/                 # Prisma ORM setup
│   │   │   ├── schema.prisma       # Database schema definition
│   │   │   ├── prisma.module.ts    # Prisma module (Global)
│   │   │   └── prisma.service.ts   # Prisma service with lifecycle hooks
│   │   ├── src/
│   │   │   ├── infrastructure/     # Infrastructure layer
│   │   │   │   ├── logger.client.ts    # HTTP client for logger service
│   │   │   │   └── logger.module.ts    # Logger module
│   │   │   ├── user/               # User domain module
│   │   │   │   ├── user.controller.ts  # REST endpoints
│   │   │   │   ├── user.service.ts     # Business logic
│   │   │   │   └── user.module.ts      # User module definition
│   │   │   ├── app.controller.ts   # Root controller
│   │   │   ├── app.module.ts       # Root module
│   │   │   ├── app.service.ts      # Root service
│   │   │   └── main.ts             # Application entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   ├── gateway/                    # API Gateway Service (Port: 3000)
│   │   ├── dist/                   # Compiled JavaScript output
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   └── api-proxy.ts    # Proxy middleware configuration
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts             # Gateway entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   └── logger/                     # Logging Service (Port: 4001)
│       ├── dist/                   # Compiled JavaScript output
│       ├── logs/                   # Log files storage
│       │   ├── combined.log        # All logs
│       │   └── error.log           # Error-level logs only
│       ├── src/
│       │   ├── modules/
│       │   │   └── logs/
│       │   │       ├── dto/
│       │   │       │   └── log.dto.ts      # Log data transfer object
│       │   │       ├── logs.controller.ts  # Log endpoints
│       │   │       └── logs.service.ts     # Log handling service
│       │   ├── utils/
│       │   │   └── winston.config.ts   # Winston logger configuration
│       │   ├── app.controller.ts
│       │   ├── app.module.ts
│       │   ├── app.service.ts
│       │   └── main.ts                 # Logger service entry point
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── libs/                           # Shared libraries (future use)
│   ├── common/                     # Common utilities
│   ├── config/                     # Shared configuration
│   ├── contracts/                  # API contracts/interfaces
│   └── types/                      # Shared TypeScript types
│
├── infra/                          # Infrastructure configurations
│   └── docker/                     # Docker configurations (for future use)
│
├── scripts/                        # Utility scripts (for future use)
│
├── package.json                    # Root package configuration
├── pnpm-workspace.yaml             # PNPM workspace definition
├── pnpm-lock.yaml                  # Dependency lock file
├── nest-cli.json                   # NestJS monorepo configuration
└── README.md                       # This file
```

---

## Services Overview

### 1. API Service (Port: 4000)

The core business logic service that handles user management operations.

**Key Features:**
- Full CRUD operations for User entity
- Prisma ORM integration with MySQL
- Automatic logging to Logger service
- Global Prisma module for database access
- RESTful API with standardized responses

**Modules:**
- **App Module**: Root application module
- **User Module**: User management functionality
- **Prisma Module**: Database connection (Global)
- **Logger Module**: Client for logging service

**Database Schema:**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  city      String
  phone     String
  createdAt DateTime @default(now())
}
```

### 2. Gateway Service (Port: 3000)

API Gateway that serves as the single entry point for all client requests.

**Key Features:**
- Request routing and proxying
- Single point of entry for clients
- HTTP proxy middleware integration
- Path rewriting (`/api/*` → `/*`)

**Routing:**
- All requests to `/api/*` are proxied to API service at `http://localhost:4000`
- Automatic origin handling for CORS
- Path rewriting removes `/api` prefix

### 3. Logger Service (Port: 4001)

Centralized logging microservice for collecting and storing logs from all services.

**Key Features:**
- Winston logger with file transport
- Structured JSON logging
- Separate error and combined log files
- HTTP endpoint for log submission
- Timestamp-based log entries

**Log Levels:**
- `info`: General information
- `warn`: Warning messages
- `error`: Error messages

**Log Storage:**
- `logs/combined.log`: All log entries
- `logs/error.log`: Error-level logs only

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **PNPM**: v10.18.1 or higher
  ```bash
  npm install -g pnpm@10.18.1
  ```
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/))
- **Git**: For version control ([Download](https://git-scm.com/))

---

## Installation

### Quick Install (Recommended)

**One command installs everything for all services:**

```bash
# Clone repository
git clone <repository-url>
cd enterprise-microservice

# Install all dependencies (root + all services)
pnpm install
```

That's it! PNPM workspaces automatically:
- ✅ Installs root dependencies
- ✅ Installs dependencies for API service
- ✅ Installs dependencies for Gateway service  
- ✅ Installs dependencies for Logger service
- ✅ Hoists common packages to save disk space
- ✅ Generates Prisma client automatically (postinstall hook)

### How It Works

PNPM workspaces read the `pnpm-workspace.yaml` file which defines:

```yaml
packages:
  - "apps/*"    # All services in apps directory
  - "libs/*"    # All shared libraries (future)
```

When you run `pnpm install` at the root:

1. **Shared dependencies** (in root `package.json`) are installed once and used by all services
2. **Service-specific dependencies** are installed only where needed
3. **Symlinks** connect everything efficiently

### Manual Installation (Alternative)

If you prefer to install each service separately:

```bash
# Install root dependencies
pnpm install

# Install each service
cd apps/api && pnpm install
cd apps/gateway && pnpm install
cd apps/logger && pnpm install
```

**Note:** This is not recommended as PNPM workspaces handle this automatically and more efficiently.

### Verify Installation

```bash
# Check all packages installed
pnpm list -r

# Verify builds work
pnpm run build

# Check for issues
pnpm run lint
```

### Clean Install

If you encounter issues:

```bash
# Remove all node_modules and reinstall
pnpm run clean:install
```

---

## Configuration

### Environment Variables

Create `.env` files in each service directory:

#### API Service (`apps/api/.env`)

```env
# Server Configuration
PORT=4000

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/enterprise_db"

# Logger Service URL
LOGGER_URL="http://localhost:4001"
```

#### Gateway Service (`apps/gateway/.env`)

```env
# Server Configuration
PORT=3000

# API Service URL (for proxying)
API_SERVICE_URL="http://localhost:4000"
```

#### Logger Service (`apps/logger/.env`)

```env
# Server Configuration
PORT=4001
```

### Database Configuration

The API service uses Prisma with MySQL. Update the `DATABASE_URL` in your `.env` file with your MySQL credentials:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

Example:
```
DATABASE_URL="mysql://root:password@localhost:3306/enterprise_db"
```

---

## Running the Application

### Option 1: Run All Services Concurrently

From the root directory, run all services at once:

```bash
pnpm run dev:all
```

This starts:
- Gateway on `http://localhost:3000`
- API on `http://localhost:4000`
- Logger on `http://localhost:4001`

### Option 2: Run Services Individually

#### Terminal 1 - Logger Service
```bash
pnpm run dev:logger
```

#### Terminal 2 - API Service
```bash
pnpm run dev:api
```

#### Terminal 3 - Gateway Service
```bash
pnpm run dev:gateway
```

### Production Build & Run

#### Build All Services
```bash
# API Service
cd apps/api && pnpm run build

# Gateway Service
cd apps/gateway && pnpm run build

# Logger Service
cd apps/logger && pnpm run build
```

#### Run Production Build
```bash
# API Service
cd apps/api && pnpm run start:prod

# Gateway Service
cd apps/gateway && pnpm run start:prod

# Logger Service
cd apps/logger && pnpm run start:prod
```

---

## Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE enterprise_db;
```

### 2. Configure Prisma

Navigate to the API service:
```bash
cd apps/api
```

### 3. Generate Prisma Client

```bash
pnpm run db:generate
```

### 4. Run Database Migrations

```bash
pnpm run db:migrate
```

This creates the `User` table with the schema defined in `prisma/schema.prisma`.

### 5. (Optional) Open Prisma Studio

```bash
pnpm run db:studio
```

Prisma Studio opens at `http://localhost:5555` for visual database management.

### Additional Database Commands

```bash
# Push schema without migration
pnpm run db:push

# Reset database (WARNING: Deletes all data)
pnpm run db:reset
```

---

## API Documentation

### Base URLs

- **Gateway**: `http://localhost:3000`
- **API Service**: `http://localhost:4000`
- **Logger Service**: `http://localhost:4001`

### User Endpoints (via Gateway)

All user endpoints are accessed through the Gateway at `http://localhost:3000/api/user`

#### 1. Get All Users

```http
GET /api/user
```

**Response:**
```json
{
  "status": true,
  "message": "User fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "city": "New York",
      "phone": "+1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Single User

```http
GET /api/user/:id
```

**Parameters:**
- `id` (path): User ID

**Response:**
```json
{
  "status": true,
  "message": "User fetched successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "city": "New York",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Create User

```http
POST /api/user
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "city": "New York",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "status": true,
  "message": "User created successfully"
}
```

#### 4. Update User

```http
PUT /api/user/:id
```

**Parameters:**
- `id` (path): User ID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "city": "Los Angeles",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "status": true,
  "message": "User updated successfully"
}
```

#### 5. Soft Delete User

```http
PATCH /api/user/:id
```

**Parameters:**
- `id` (path): User ID

**Response:**
```text
Soft Deleted Successfully {id}
```

#### 6. Delete User (Hard Delete)

```http
DELETE /api/user/:id
```

**Parameters:**
- `id` (path): User ID

**Response:**
```json
{
  "status": true,
  "message": "User Deleted successfully"
}
```

### Logger Endpoints (Direct)

#### Submit Log Entry

```http
POST http://localhost:4001/logs
```

**Request Body:**
```json
{
  "message": "User logged in successfully",
  "level": "info",
  "meta": {
    "userId": 1,
    "action": "login"
  }
}
```

**Response:**
```json
{
  "status": "logged"
}
```

**Log Levels:**
- `info` (default)
- `warn`
- `error`

---

## Logging System

### Architecture

The logging system is implemented as a separate microservice that receives log entries via HTTP POST requests and stores them using Winston.

### How It Works

1. **Logger Client** (in API service):
   - `LoggerClient` class sends HTTP POST requests to Logger service
   - Automatically includes message, level, and metadata
   - Non-blocking (fire-and-forget) for performance

2. **Logger Service**:
   - Receives log entries via REST endpoint
   - Uses Winston for structured logging
   - Writes to file transports with JSON format
   - Separates error logs for easier debugging

### Using the Logger in Your Code

```typescript
import { LoggerClient } from '../infrastructure/logger.client';

@Controller('user')
export class UserController {
  constructor(private readonly loggerClient: LoggerClient) {}

  @Get()
  async getUsers() {
    // Log with info level
    this.loggerClient.log('Fetching all users', 'info');
    
    // Log with metadata
    this.loggerClient.log('User created', 'info', { 
      userId: 123, 
      email: 'user@example.com' 
    });
    
    // Log warnings
    this.loggerClient.log('Deprecated API called', 'warn');
    
    // Log errors
    this.loggerClient.log('Database connection failed', 'error', { 
      error: errorDetails 
    });
  }
}
```

### Log File Locations

- **Combined logs**: `apps/logger/logs/combined.log`
- **Error logs**: `apps/logger/logs/error.log`

### Log Format

All logs are stored in JSON format with timestamps:

```json
{
  "message": "User created successfully",
  "level": "info",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": 123,
  "action": "create_user"
}
```

---

## Dependency Management

### Understanding the Monorepo Structure

This project uses **PNPM Workspaces** for efficient dependency management across all services.

#### Key Files

1. **`pnpm-workspace.yaml`** - Defines which directories are workspaces
2. **`.npmrc`** - PNPM configuration (hoisting, peer dependencies, etc.)
3. **Root `package.json`** - Shared dependencies used by all services
4. **Service `package.json`** - Service-specific dependencies

### Adding Dependencies

#### Add to All Services (Shared Dependencies)

```bash
# Add shared dependency at root level
pnpm add <package-name> -w

# Example: Add a shared utility library
pnpm add lodash -w

# Add shared dev dependency
pnpm add -D <package-name> -w
```

**When to use:** When ALL services need the same package (e.g., `@nestjs/common`, `typescript`)

#### Add to Specific Service

```bash
# Add to API service only
pnpm --filter api add <package-name>

# Add to Gateway service only
pnpm --filter gateway add <package-name>

# Add to Logger service only
pnpm --filter logger add <package-name>

# Example: Add Prisma only to API service
pnpm --filter api add @prisma/client
```

**When to use:** When only ONE service needs the package (e.g., `prisma` for API, `http-proxy-middleware` for Gateway)

### Removing Dependencies

```bash
# Remove from root
pnpm remove <package-name> -w

# Remove from specific service
pnpm --filter api remove <package-name>
```

### Updating Dependencies

```bash
# Update all dependencies in all workspaces
pnpm update -r

# Update specific package everywhere
pnpm update <package-name> -r

# Interactive update
pnpm update --interactive --latest -r
```

### Best Practices

1. **Keep root clean**: Only add truly shared dependencies to root
2. **Service isolation**: Each service should be independently installable
3. **Version consistency**: Use same versions across services when possible
4. **Lock file**: Always commit `pnpm-lock.yaml`
5. **Peer dependencies**: Let PNPM auto-install peers (configured in `.npmrc`)

### Dependency Audit

```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix

# List outdated packages
pnpm outdated -r
```

---

## Development Workflow

### Project Structure Guidelines

1. **Service Independence**: Each service should be independently deployable
2. **Shared Code**: Place reusable code in `libs/` directory
3. **Module Organization**: Follow domain-driven design patterns
4. **Configuration**: Use environment variables for configuration

### Adding a New Service

1. Create new directory in `apps/`:
```bash
cd apps
nest new my-service
```

2. Update `pnpm-workspace.yaml` if needed (already includes `apps/*`)

3. Add scripts to root `package.json`:
```json
{
  "scripts": {
    "dev:my-service": "pnpm --filter my-service start:dev"
  }
}
```

4. Configure service port and environment variables

### Adding a New Feature to API Service

1. Generate module:
```bash
cd apps/api
nest generate module feature-name
```

2. Generate controller and service:
```bash
nest generate controller feature-name
nest generate service feature-name
```

3. Update Prisma schema if database changes needed:
```prisma
// Add to apps/api/prisma/schema.prisma
model NewEntity {
  id Int @id @default(autoincrement())
  // fields...
}
```

4. Run migration:
```bash
pnpm run db:migrate
```

### Code Quality

#### Linting

```bash
# Lint all services
cd apps/api && pnpm run lint
cd apps/gateway && pnpm run lint
cd apps/logger && pnpm run lint
```

#### Formatting

```bash
# Format code in each service
cd apps/api && pnpm run format
```

#### Testing

```bash
# Unit tests
cd apps/api && pnpm run test

# E2E tests
cd apps/api && pnpm run test:e2e

# Test coverage
cd apps/api && pnpm run test:cov
```

---

## Scripts

### Root Level Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Installation** |
| `pnpm install` | `pnpm install` | Install all dependencies (root + all services) |
| `pnpm run install:all` | `pnpm install` | Same as above (explicit) |
| `pnpm run clean` | `pnpm -r exec rm -rf node_modules dist` | Remove all node_modules and dist folders |
| `pnpm run clean:install` | Clean + install | Fresh installation |
| **Development** |
| `pnpm run dev:api` | Start API service | Run API in development mode (port 4000) |
| `pnpm run dev:logger` | Start Logger service | Run Logger in development mode (port 4001) |
| `pnpm run dev:gateway` | Start Gateway service | Run Gateway in development mode (port 3000) |
| `pnpm run dev:all` | Start all services | Run all services concurrently with colored output |
| **Production** |
| `pnpm run build` | Build all services | Compile all services to JavaScript |
| `pnpm run build:api` | Build API service | Build API only |
| `pnpm run build:gateway` | Build Gateway service | Build Gateway only |
| `pnpm run build:logger` | Build Logger service | Build Logger only |
| `pnpm run start:all` | Start all (prod) | Run all services in production mode |
| **Database** |
| `pnpm run db:generate` | Generate Prisma client | Generate TypeScript types from schema |
| `pnpm run db:migrate` | Run migrations | Create/update database schema |
| `pnpm run db:studio` | Open Prisma Studio | Visual database editor |
| `pnpm run db:push` | Push schema | Push schema changes without migration |
| `pnpm run db:reset` | Reset database | ⚠️ Drops and recreates database |
| **Code Quality** |
| `pnpm run lint` | Lint all services | Run ESLint on all services |
| `pnpm run lint:fix` | Fix linting issues | Auto-fix ESLint issues |
| `pnpm run format` | Format code | Run Prettier on all services |
| `pnpm run test` | Run all tests | Execute tests for all services |
| `pnpm run test:watch` | Run tests (watch) | Run tests in watch mode |
| `pnpm run test:cov` | Test coverage | Generate coverage reports |

### API Service Scripts

| Script | Description |
|--------|-------------|
| `pnpm run build` | Build the service |
| `pnpm run start` | Start in production mode |
| `pnpm run start:dev` | Start in development mode with watch |
| `pnpm run start:debug` | Start in debug mode |
| `pnpm run db:migrate` | Run Prisma migrations |
| `pnpm run db:generate` | Generate Prisma client |
| `pnpm run db:studio` | Open Prisma Studio |
| `pnpm run db:push` | Push schema to database |
| `pnpm run db:reset` | Reset database |
| `pnpm run lint` | Run ESLint |
| `pnpm run test` | Run unit tests |
| `pnpm run test:e2e` | Run E2E tests |

### Gateway Service Scripts

| Script | Description |
|--------|-------------|
| `pnpm run build` | Build the service |
| `pnpm run start` | Start in production mode |
| `pnpm run start:dev` | Start in development mode with watch |
| `pnpm run start:debug` | Start in debug mode |
| `pnpm run lint` | Run ESLint |
| `pnpm run test` | Run unit tests |

### Logger Service Scripts

| Script | Description |
|--------|-------------|
| `pnpm run build` | Build the service |
| `pnpm run start` | Start in production mode |
| `pnpm run start:dev` | Start in development mode with watch |
| `pnpm run start:debug` | Start in debug mode |
| `pnpm run lint` | Run ESLint |
| `pnpm run test` | Run unit tests |

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/enterprise-microservice.git
```
3. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

### Development Guidelines

1. **Code Style**: Follow the existing code style and use the linter
2. **Commits**: Write clear, descriptive commit messages
3. **Testing**: Add tests for new features
4. **Documentation**: Update README if adding new features

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(api): add user profile endpoint

- Add GET /api/user/:id/profile endpoint
- Include profile image and bio fields
- Add corresponding tests

Closes #123
```

### Pull Request Process

1. Update documentation for any changed functionality
2. Run linter and tests to ensure everything passes
3. Update the README.md with details of changes if needed
4. Submit a pull request with a clear title and description
5. Link any relevant issues

### Code Review Process

- All PRs require at least one approval
- Address all review comments
- Keep PRs focused and reasonably sized
- Squash commits before merging if requested

### Testing Requirements

- Unit tests for all new business logic
- E2E tests for new API endpoints
- Maintain or improve code coverage

### Directory Structure for New Features

```
apps/api/src/
└── feature-name/
    ├── dto/
    │   └── feature.dto.ts
    ├── entities/
    │   └── feature.entity.ts
    ├── feature.controller.ts
    ├── feature.service.ts
    ├── feature.module.ts
    └── tests/
        ├── feature.controller.spec.ts
        └── feature.service.spec.ts
```

---

## Technical Details

### Design Patterns Used

1. **Module Pattern**: NestJS modules for organizing code
2. **Dependency Injection**: Constructor-based DI throughout the application
3. **Repository Pattern**: Prisma service acts as repository
4. **DTO Pattern**: Data transfer objects for API contracts
5. **Proxy Pattern**: Gateway service proxies requests

### Key Architectural Decisions

1. **Monorepo Structure**: 
   - Simplifies development and dependency management
   - Enables code sharing between services
   - PNPM workspaces for efficient package management

2. **HTTP Communication**: 
   - Simple and universally compatible
   - Easy to debug and monitor
   - Can be upgraded to gRPC for performance

3. **Centralized Logging**: 
   - Single source of truth for all logs
   - Easier debugging and monitoring
   - Scalable to log aggregation services

4. **Database per Service**: 
   - Each service owns its data
   - Independent scaling and deployment
   - Currently only API service has a database

### Performance Considerations

- **Non-blocking Logging**: Logger client doesn't wait for response
- **Connection Pooling**: Prisma manages database connections efficiently
- **Hot Reload**: Fast development with automatic restarts
- **Incremental Builds**: TypeScript incremental compilation

### Security Considerations

- **Environment Variables**: Sensitive data stored in .env files
- **Input Validation**: Use class-validator for request validation
- **SQL Injection**: Prisma ORM prevents SQL injection
- **CORS**: Configure in Gateway for cross-origin requests

### Scalability

The architecture supports:
- **Horizontal Scaling**: Deploy multiple instances of each service
- **Load Balancing**: Gateway can be load balanced
- **Database Replication**: MySQL supports master-slave replication
- **Caching**: Can add Redis for session/data caching
- **Message Queues**: Can integrate RabbitMQ/Kafka for async communication

---

## Future Enhancements

### Planned Features

- [ ] Docker containerization for all services
- [ ] Kubernetes deployment configurations
- [ ] Redis caching layer
- [ ] RabbitMQ/Kafka for message queuing
- [ ] Authentication & Authorization (JWT)
- [ ] API rate limiting
- [ ] Swagger/OpenAPI documentation
- [ ] Health check endpoints
- [ ] Metrics and monitoring (Prometheus/Grafana)
- [ ] CI/CD pipeline (GitHub Actions/GitLab CI)
- [ ] Database migration versioning
- [ ] File upload service
- [ ] Email notification service

### Libs Directory Usage

The `libs/` directory is prepared for shared code:

- **libs/common**: Shared utilities, helpers, decorators
- **libs/config**: Shared configuration modules
- **libs/contracts**: API contracts and interfaces
- **libs/types**: Shared TypeScript type definitions

Example usage:
```typescript
import { HttpExceptionFilter } from '@app/common';
import { DatabaseConfig } from '@app/config';
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using the port (Windows)
netstat -ano | findstr :4000

# Kill the process
taskkill /PID <process_id> /F

# On Linux/Mac
lsof -ti:4000 | xargs kill -9
```

#### 2. Database Connection Failed

**Error**: `Can't reach database server`

**Solution**:
- Verify MySQL is running
- Check DATABASE_URL in .env file
- Ensure database exists
- Verify credentials

#### 3. Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
cd apps/api
pnpm run db:generate
```

#### 4. PNPM Not Found

**Error**: `pnpm: command not found`

**Solution**:
```bash
npm install -g pnpm@10.18.1
```

#### 5. Module Resolution Issues

**Error**: `Cannot find module 'src/...'`

**Solution**:
- Check tsconfig.json baseUrl
- Verify import paths
- Rebuild the project

---

## Environment Setup Checklist

- [ ] Node.js v18+ installed
- [ ] PNPM v10.18.1+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Repository cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] .env files created for all services
- [ ] Database created
- [ ] Prisma migrations run
- [ ] All services start successfully

---

## Resources

### Official Documentation

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PNPM Documentation](https://pnpm.io)
- [Winston Logger](https://github.com/winstonjs/winston)

### Related Technologies

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Microservices Patterns

- [Microservices.io](https://microservices.io/patterns/index.html)
- [API Gateway Pattern](https://microservices.io/patterns/apigateway.html)
- [Database per Service](https://microservices.io/patterns/data/database-per-service.html)

---

## License

This project is licensed under the ISC License.

---

## Support

For issues, questions, or contributions, please:

1. Check existing [issues](link-to-issues)
2. Create a new issue with detailed description
3. Join our community discussions
4. Contact the maintainers

---

## Acknowledgments

- Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework
- Database management by [Prisma](https://www.prisma.io/)
- Logging powered by [Winston](https://github.com/winstonjs/winston)
- Package management by [PNPM](https://pnpm.io/)

---

**Happy Coding! 🚀**

