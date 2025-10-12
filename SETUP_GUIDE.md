# Quick Setup Guide

This guide will help you set up the Enterprise Microservice project in under 10 minutes.

## 🚀 Quick Start (TL;DR)

```bash
# 1. Clone and navigate
git clone <repository-url>
cd enterprise-microservice

# 2. Install all dependencies (installs for all services automatically)
pnpm install

# 3. Configure environment (copy and edit)
cp apps/api/.env.example apps/api/.env
cp apps/gateway/.env.example apps/gateway/.env
cp apps/logger/.env.example apps/logger/.env

# 4. Setup database
mysql -u root -p -e "CREATE DATABASE enterprise_db;"
pnpm run db:migrate

# 5. Run all services
pnpm run dev:all
```

## 📦 How Dependencies Work in This Monorepo

### PNPM Workspaces Magic ✨

When you run `pnpm install` at the root:

1. **Installs root dependencies** - Common tools like TypeScript, NestJS CLI
2. **Installs all workspace dependencies** - Dependencies for API, Gateway, and Logger services
3. **Hoists common packages** - Saves disk space by sharing common dependencies
4. **Links workspace packages** - Creates symlinks between services if they depend on each other

### Directory Structure After Installation

```
enterprise-microservice/
├── node_modules/              # Shared dependencies (hoisted)
│   ├── @nestjs/
│   ├── typescript/
│   └── ... (common packages)
│
├── apps/
│   ├── api/
│   │   ├── node_modules/      # API-specific dependencies only
│   │   └── package.json       # API dependencies
│   │
│   ├── gateway/
│   │   ├── node_modules/      # Gateway-specific dependencies only
│   │   └── package.json       # Gateway dependencies
│   │
│   └── logger/
│       ├── node_modules/      # Logger-specific dependencies only
│       └── package.json       # Logger dependencies
│
└── package.json               # Root + shared dependencies
```

## 🎯 What Gets Installed Where?

### Root `package.json` (Workspace Root)

**Shared across ALL services:**

```json
{
  "dependencies": {
    "@nestjs/common": "^11.1.6",      // ✅ Used by all services
    "@nestjs/core": "^11.1.6",         // ✅ Used by all services
    "@nestjs/platform-express": "^11.1.6",  // ✅ Used by all services
    "reflect-metadata": "^0.2.2",      // ✅ Required by all NestJS apps
    "rxjs": "^7.8.1"                   // ✅ Used by all services
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.10",         // ✅ Development tool for all
    "typescript": "^5.9.3",            // ✅ Build tool for all
    "eslint": "^9.18.0",               // ✅ Linting for all
    "prettier": "^3.4.2"               // ✅ Formatting for all
  }
}
```

### Service-Specific `package.json`

**Only service-specific dependencies:**

- **API Service**: `prisma`, `@prisma/client`, `class-validator`, `class-transformer`
- **Gateway Service**: `http-proxy-middleware`
- **Logger Service**: `winston` (if not needed by others)

## 📝 Step-by-Step Installation

### 1. Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check PNPM version (should be 10+)
pnpm --version

# If PNPM not installed:
npm install -g pnpm@10.18.1

# Check MySQL
mysql --version
```

### 2. Clone Repository

```bash
git clone <repository-url>
cd enterprise-microservice
```

### 3. Install Dependencies

**This is the key step - one command installs everything:**

```bash
pnpm install
```

**What happens:**
- ✅ Reads `pnpm-workspace.yaml`
- ✅ Installs dependencies for root
- ✅ Installs dependencies for `apps/api`
- ✅ Installs dependencies for `apps/gateway`
- ✅ Installs dependencies for `apps/logger`
- ✅ Installs dependencies for `libs/*` (when you add shared libraries)
- ✅ Runs `postinstall` script (generates Prisma client)
- ✅ Creates `pnpm-lock.yaml` (locks all versions)

**Alternative commands:**

```bash
# Clean install (removes all node_modules first)
pnpm run clean:install

# Install specific service only
pnpm --filter api install

# Install and update all packages
pnpm update -r
```

### 4. Environment Configuration

Create `.env` files for each service:

#### API Service (`apps/api/.env`)

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="mysql://root:password@localhost:3306/enterprise_db"

# Logger Service
LOGGER_URL="http://localhost:4001"
```

#### Gateway Service (`apps/gateway/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Backend Services
API_SERVICE_URL="http://localhost:4000"
```

#### Logger Service (`apps/logger/.env`)

```env
# Server
PORT=4001
NODE_ENV=development

# Log Configuration
LOG_LEVEL=info
```

### 5. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE enterprise_db;"

# Run Prisma migrations (creates tables)
pnpm run db:migrate

# (Optional) Open Prisma Studio to view database
pnpm run db:studio
```

### 6. Verify Installation

```bash
# Check all services build successfully
pnpm run build

# Check for any linting issues
pnpm run lint

# Run tests (optional)
pnpm run test
```

### 7. Start Development

```bash
# Option 1: Start all services at once (Recommended)
pnpm run dev:all

# Option 2: Start services individually
# Terminal 1:
pnpm run dev:logger

# Terminal 2:
pnpm run dev:api

# Terminal 3:
pnpm run dev:gateway
```

### 8. Test the Setup

Open your browser or use curl:

```bash
# Test Gateway
curl http://localhost:3000

# Test API through Gateway
curl http://localhost:3000/api/user

# Test Logger directly
curl http://localhost:4001
```

## 🔧 Useful Commands

### Dependency Management

```bash
# Add dependency to root (shared)
pnpm add <package-name> -w

# Add dependency to specific service
pnpm --filter api add <package-name>

# Add dev dependency
pnpm add -D <package-name> -w

# Remove dependency
pnpm remove <package-name>

# Update all dependencies
pnpm update -r

# List all dependencies
pnpm list -r
```

### Development

```bash
# Run all services
pnpm run dev:all

# Run specific service
pnpm run dev:api
pnpm run dev:gateway
pnpm run dev:logger

# Build all services
pnpm run build

# Build specific service
pnpm run build:api
```

### Database

```bash
# Generate Prisma client
pnpm run db:generate

# Create and run migration
pnpm run db:migrate

# Push schema without migration
pnpm run db:push

# Reset database (⚠️ deletes data)
pnpm run db:reset

# Open Prisma Studio
pnpm run db:studio
```

### Code Quality

```bash
# Lint all services
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:cov

# Run tests in watch mode
pnpm run test:watch
```

### Cleanup

```bash
# Remove all node_modules and dist folders
pnpm run clean

# Clean and reinstall
pnpm run clean:install
```

## 🐛 Troubleshooting

### Issue: "pnpm: command not found"

```bash
# Install PNPM globally
npm install -g pnpm@10.18.1

# Or use Corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@10.18.1 --activate
```

### Issue: "Port already in use"

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

### Issue: "Prisma Client not generated"

```bash
cd apps/api
pnpm run db:generate
```

### Issue: "Cannot connect to database"

1. Check MySQL is running
2. Verify DATABASE_URL in `.env`
3. Ensure database exists
4. Check username/password

### Issue: "Dependencies not syncing"

```bash
# Remove lock file and reinstall
rm pnpm-lock.yaml
rm -rf node_modules
pnpm install
```

### Issue: "Module not found after install"

```bash
# Clear PNPM cache
pnpm store prune

# Reinstall
pnpm run clean:install
```

## 📊 Installation Verification Checklist

- [ ] Node.js v18+ installed
- [ ] PNPM v10+ installed
- [ ] MySQL running
- [ ] Repository cloned
- [ ] `pnpm install` completed without errors
- [ ] `.env` files created for all services
- [ ] Database created and migrated
- [ ] All services start with `pnpm run dev:all`
- [ ] Gateway responds at http://localhost:3000
- [ ] API responds at http://localhost:4000
- [ ] Logger responds at http://localhost:4001

## 🎓 Understanding PNPM Workspaces

### Why PNPM Workspaces?

1. **Efficient Storage**: Shared dependencies stored once
2. **Fast Installation**: Content-addressable store
3. **Strict Dependencies**: No phantom dependencies
4. **Workspace Protocol**: Easy inter-package dependencies
5. **Better DX**: Single install command for everything

### Workspace Configuration

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - "apps/*"    # All services in apps/
  - "libs/*"    # All shared libraries in libs/
```

**`.npmrc`:**
```ini
hoist=true                    # Move common deps to root
auto-install-peers=true       # Auto-install peer deps
strict-peer-dependencies=false # Don't fail on peer conflicts
```

### Adding Inter-Service Dependencies

If you want one service to depend on a shared library:

```bash
# In apps/api/package.json
{
  "dependencies": {
    "@app/common": "workspace:*"  // Links to libs/common
  }
}
```

Then run:
```bash
pnpm install
```

## 🚀 Next Steps

After successful installation:

1. ✅ Read the [README.md](./README.md) for architecture overview
2. ✅ Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
3. ✅ Explore the API endpoints
4. ✅ Add your first feature
5. ✅ Write tests
6. ✅ Submit a pull request

## 📚 Additional Resources

- [PNPM Documentation](https://pnpm.io/workspaces)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Need help?** Open an issue or check existing discussions!

