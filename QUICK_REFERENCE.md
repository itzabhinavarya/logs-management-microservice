# Quick Reference Card

Print this out and keep it handy! 📌

## 🚀 Installation

```bash
# Install everything (root + all services)
pnpm install

# Clean install (if issues)
pnpm run clean:install
```

## 📦 Adding Dependencies

```bash
# Add to ALL services (shared)
pnpm add <package-name> -w

# Add to SPECIFIC service
pnpm --filter api add <package-name>
pnpm --filter gateway add <package-name>
pnpm --filter logger add <package-name>

# Add dev dependency
pnpm add -D <package-name> -w
```

## 🗑️ Removing Dependencies

```bash
# Remove from root
pnpm remove <package-name> -w

# Remove from service
pnpm --filter api remove <package-name>
```

## 🔄 Updating Dependencies

```bash
# Update all (interactive)
pnpm update --interactive --latest -r

# Update specific package
pnpm update <package-name> -r

# Check outdated
pnpm outdated -r
```

## 🏃 Running Services

```bash
# All services (colored output)
pnpm run dev:all

# Individual services
pnpm run dev:api      # Port 4000
pnpm run dev:gateway  # Port 3000
pnpm run dev:logger   # Port 4001
```

## 🔨 Building

```bash
# Build all services
pnpm run build

# Build specific
pnpm run build:api
pnpm run build:gateway
pnpm run build:logger
```

## 🧪 Testing

```bash
# Test all services
pnpm run test

# Test with coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

## 🎨 Code Quality

```bash
# Lint all
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format
```

## 🗄️ Database

```bash
# Generate Prisma client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Open Prisma Studio
pnpm run db:studio

# Push schema
pnpm run db:push

# Reset database ⚠️
pnpm run db:reset
```

## 🧹 Cleanup

```bash
# Remove all node_modules
pnpm run clean

# Clean + reinstall
pnpm run clean:install
```

## 🔍 Debugging

```bash
# List all packages
pnpm list -r

# Check specific package
pnpm why <package-name>

# Audit security
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

## 📊 Decision Tree

**Where should I add this package?**

```
Used by ALL services?
├─ YES → pnpm add <pkg> -w
└─ NO → Used by 2+ services?
    ├─ YES → Consider root OR shared lib
    └─ NO → pnpm --filter <service> add <pkg>
```

## 🎯 Common Patterns

```bash
# Add shared dependency
pnpm add lodash -w

# Add to API only
pnpm --filter api add @prisma/client

# Remove from root
pnpm remove old-package -w

# Update all interactively
pnpm update -i -r
```

## 🔗 Ports

| Service | Port | URL |
|---------|------|-----|
| Gateway | 3000 | http://localhost:3000 |
| API     | 4000 | http://localhost:4000 |
| Logger  | 4001 | http://localhost:4001 |

## 📝 File Locations

```
enterprise-microservice/
├── .npmrc                 # PNPM config
├── package.json           # Root deps + scripts
├── pnpm-workspace.yaml    # Workspace definition
├── pnpm-lock.yaml         # Version lock
│
├── apps/
│   ├── api/
│   │   ├── .env           # API config
│   │   └── package.json   # API deps
│   ├── gateway/
│   │   ├── .env           # Gateway config
│   │   └── package.json   # Gateway deps
│   └── logger/
│       ├── .env           # Logger config
│       └── package.json   # Logger deps
│
└── Documentation/
    ├── README.md                    # Complete guide
    ├── SETUP_GUIDE.md              # Quick setup
    ├── DEPENDENCY_MANAGEMENT.md    # Dependency guide
    ├── CONTRIBUTING.md             # How to contribute
    ├── WORKSPACE_ARCHITECTURE.md   # Architecture visual
    └── QUICK_REFERENCE.md          # This file
```

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| "pnpm not found" | `npm install -g pnpm@10.18.1` |
| "Cannot find module" | `pnpm run clean:install` |
| "Port in use" | `netstat -ano \| findstr :4000` then `taskkill /PID <pid> /F` |
| "Prisma client missing" | `pnpm run db:generate` |
| "Database error" | Check `.env` DATABASE_URL |

## 💡 Pro Tips

1. **Use filters for speed:**
   ```bash
   pnpm --filter api test  # Test API only
   ```

2. **Frozen lockfile in CI:**
   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Check what uses a package:**
   ```bash
   pnpm why lodash
   ```

4. **Interactive updates:**
   ```bash
   pnpm update -i -r --latest
   ```

5. **Run command in all workspaces:**
   ```bash
   pnpm -r exec <command>
   ```

## 🎓 Documentation Links

- [Complete README](./README.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Dependency Management](./DEPENDENCY_MANAGEMENT.md)
- [Contributing](./CONTRIBUTING.md)
- [Architecture](./WORKSPACE_ARCHITECTURE.md)

## ⚡ Super Quick Start

```bash
# 1. Install everything
pnpm install

# 2. Configure environment
# Edit apps/*/. env files

# 3. Setup database
pnpm run db:migrate

# 4. Start everything
pnpm run dev:all

# 5. Test
curl http://localhost:3000/api/user
```

---

**Keep this card handy!** 📌

Print or bookmark this page for quick reference during development.

