# Dependency Management Guide

Complete guide for managing dependencies in the Enterprise Microservice monorepo.

## 📦 Overview

This project uses **PNPM Workspaces** for efficient dependency management across multiple services. This approach provides:

- **Single installation command** for all services
- **Shared dependencies** to save disk space
- **Version consistency** across services
- **Fast installations** with content-addressable storage

## 🏗️ Workspace Structure

```
enterprise-microservice/
├── package.json              # Root: Shared dependencies
├── pnpm-workspace.yaml       # Workspace configuration
├── pnpm-lock.yaml           # Lock file (commit this!)
├── .npmrc                   # PNPM settings
└── apps/
    ├── api/
    │   └── package.json      # API-specific dependencies
    ├── gateway/
    │   └── package.json      # Gateway-specific dependencies
    └── logger/
        └── package.json      # Logger-specific dependencies
```

## 📝 Configuration Files

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"    # All services
  - "libs/*"    # Shared libraries
```

This tells PNPM to treat all directories in `apps/` and `libs/` as workspace packages.

### `.npmrc`

```ini
# Enable hoisting (move common deps to root)
hoist=true
hoist-pattern[]=*

# Auto-install peer dependencies
auto-install-peers=true
strict-peer-dependencies=false

# Use symlinks for workspace packages
symlink=true

# Engine strict (enforce Node.js version)
engine-strict=true
```

### Root `package.json`

**Purpose:** Shared dependencies used by ALL services

```json
{
  "dependencies": {
    "@nestjs/common": "^11.1.6",      // Used by all services
    "@nestjs/core": "^11.1.6",         // Used by all services
    "reflect-metadata": "^0.2.2",      // Required by NestJS
    "rxjs": "^7.8.1"                   // Used by all services
  },
  "devDependencies": {
    "typescript": "^5.9.3",            // Build tool for all
    "@nestjs/cli": "^11.0.10",         // Development tool
    "eslint": "^9.18.0",               // Linting for all
    "prettier": "^3.4.2"               // Formatting for all
  }
}
```

### Service `package.json`

**Purpose:** Service-specific dependencies only

**API Service:**
```json
{
  "dependencies": {
    "@prisma/client": "^6.17.0",      // Only API needs database
    "class-validator": "^0.14.1",     // Only API validates DTOs
    "class-transformer": "^0.5.1"     // Only API transforms data
  },
  "devDependencies": {
    "prisma": "^6.17.0"                // Only API has schema
  }
}
```

**Gateway Service:**
```json
{
  "dependencies": {
    "http-proxy-middleware": "^3.0.5"  // Only Gateway proxies
  }
}
```

## 🚀 Common Commands

### Installation

```bash
# Install all dependencies (root + all services)
pnpm install

# Install specific service only
pnpm --filter api install

# Clean install (remove node_modules first)
pnpm run clean:install

# Install from lock file only (CI/CD)
pnpm install --frozen-lockfile
```

### Adding Dependencies

#### Shared Dependency (Root)

```bash
# Add to root (shared by all services)
pnpm add <package-name> -w

# Examples:
pnpm add lodash -w                    # Production dependency
pnpm add -D jest -w                   # Dev dependency
pnpm add @types/node@22.18.8 -w      # Specific version
```

**When to use:**
- ✅ Package used by ALL services
- ✅ Build tools (TypeScript, ESLint, Prettier)
- ✅ Common utilities
- ✅ Framework packages (@nestjs/*)

#### Service-Specific Dependency

```bash
# Add to specific service
pnpm --filter <service-name> add <package-name>

# Examples:
pnpm --filter api add prisma                 # Add to API
pnpm --filter gateway add axios              # Add to Gateway
pnpm --filter logger add winston             # Add to Logger
pnpm --filter api add -D @types/jest         # Add dev dependency
```

**When to use:**
- ✅ Package used by ONLY ONE service
- ✅ Service-specific tools (Prisma, Winston)
- ✅ Specialized middleware
- ✅ Service-specific types

### Removing Dependencies

```bash
# Remove from root
pnpm remove <package-name> -w

# Remove from specific service
pnpm --filter api remove <package-name>

# Examples:
pnpm remove lodash -w                        # Remove from root
pnpm --filter api remove old-package         # Remove from API
```

### Updating Dependencies

```bash
# Update all dependencies in all workspaces
pnpm update -r

# Update specific package everywhere
pnpm update typescript -r

# Update to latest versions (interactive)
pnpm update --interactive --latest -r

# Update specific service only
pnpm --filter api update
```

### Listing Dependencies

```bash
# List all dependencies in all workspaces
pnpm list -r

# List dependencies in specific service
pnpm --filter api list

# List outdated packages
pnpm outdated -r

# Show dependency tree
pnpm list -r --depth 2
```

## 🔍 Advanced Operations

### Workspace Protocol

Link internal packages (for libs):

```json
// In apps/api/package.json
{
  "dependencies": {
    "@app/common": "workspace:*"
  }
}
```

This creates a symlink to `libs/common`.

### Filtering

```bash
# Run command in multiple workspaces
pnpm -r exec npm run build                   # All workspaces

# Run only in apps (not libs)
pnpm --filter './apps/*' run build

# Run in multiple specific services
pnpm --filter api --filter gateway run build

# Run with pattern
pnpm --filter '*-service' run test
```

### Recursive Commands

```bash
# Run build in all services
pnpm -r run build

# Run tests in all services
pnpm -r run test

# Clean all node_modules
pnpm -r exec rm -rf node_modules

# Lint all services
pnpm -r run lint
```

## 🎯 Decision Tree: Where to Add a Dependency?

```
Is the package used by ALL services?
│
├─ YES → Add to ROOT
│         pnpm add <package> -w
│
└─ NO → Is it used by multiple services?
         │
         ├─ YES → Consider adding to ROOT
         │         OR create a shared library in libs/
         │
         └─ NO → Add to specific service
                  pnpm --filter <service> add <package>
```

## 📊 Example Scenarios

### Scenario 1: Adding Lodash

**Question:** Should lodash be at root or service-specific?

**Answer:** Depends on usage:
- If ALL services use it → Root: `pnpm add lodash -w`
- If ONLY API uses it → Service: `pnpm --filter api add lodash`

### Scenario 2: Adding Validation Library

**Question:** Need `class-validator` for API service.

**Answer:**
```bash
# Only API service validates DTOs
pnpm --filter api add class-validator
pnpm --filter api add class-transformer
```

### Scenario 3: Updating TypeScript

**Question:** Need to update TypeScript version.

**Answer:**
```bash
# TypeScript is shared, update at root
pnpm update typescript -w

# Or specify version
pnpm add -D typescript@5.9.3 -w
```

### Scenario 4: Adding New Service

**Question:** Adding a new "notification" service.

**Steps:**
```bash
# 1. Create service directory
mkdir apps/notification
cd apps/notification

# 2. Initialize package.json
pnpm init

# 3. Add service-specific dependencies
pnpm add nodemailer

# 4. Install from root (includes shared deps)
cd ../..
pnpm install
```

### Scenario 5: Creating Shared Library

**Question:** Want to share utilities across services.

**Steps:**
```bash
# 1. Create shared library
mkdir -p libs/common/src
cd libs/common

# 2. Initialize
pnpm init
# Set name to @app/common

# 3. Create index.ts
echo "export * from './src';" > index.ts

# 4. Use in services
# In apps/api/package.json:
{
  "dependencies": {
    "@app/common": "workspace:*"
  }
}

# 5. Install
cd ../..
pnpm install
```

## 🔒 Version Management

### Lock File

**Always commit `pnpm-lock.yaml`!**

```bash
# Lock file benefits:
✅ Reproducible builds
✅ Consistent versions across team
✅ Faster CI/CD installations
✅ Security audit history
```

### Version Strategies

**Option 1: Ranges (Default)**
```json
{
  "dependencies": {
    "axios": "^1.12.2"    // Updates: 1.12.x, 1.13.x, etc.
  }
}
```

**Option 2: Exact Versions**
```json
{
  "dependencies": {
    "axios": "1.12.2"     // No automatic updates
  }
}
```

To use exact versions:
```bash
# Add to .npmrc
save-exact=true

# Or use flag
pnpm add axios --save-exact
```

## 🛡️ Security

### Audit Dependencies

```bash
# Check for vulnerabilities
pnpm audit

# Get detailed report
pnpm audit --json

# Fix vulnerabilities
pnpm audit --fix
```

### Update Strategy

```bash
# 1. Check outdated packages
pnpm outdated -r

# 2. Update interactively (recommended)
pnpm update --interactive --latest -r

# 3. Test everything
pnpm run test

# 4. Commit updated lock file
git add pnpm-lock.yaml
git commit -m "chore: update dependencies"
```

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
# Regenerate lock file
rm pnpm-lock.yaml
pnpm install
```

### Issue: "Peer dependency warning"

**Solution:**
```bash
# Auto-install peers (already configured in .npmrc)
auto-install-peers=true

# Or install manually
pnpm add <peer-dependency> -w
```

### Issue: "Version conflict"

**Solution:**
```bash
# Check which services use the package
pnpm why <package-name>

# Align versions
pnpm update <package-name> -r --latest
```

### Issue: "Phantom dependency"

**Problem:** Service uses package not in its package.json

**Solution:**
```bash
# Add explicit dependency
pnpm --filter <service> add <package-name>
```

### Issue: "Installation slow"

**Solution:**
```bash
# Clear PNPM cache
pnpm store prune

# Use lockfile only
pnpm install --frozen-lockfile

# Check network
pnpm config get registry
```

## 📚 Best Practices Checklist

- [ ] Keep root package.json for shared dependencies only
- [ ] Add service-specific deps to service package.json
- [ ] Always commit pnpm-lock.yaml
- [ ] Run `pnpm audit` regularly
- [ ] Use `--filter` for service-specific operations
- [ ] Update dependencies with `--interactive` flag
- [ ] Test after updating dependencies
- [ ] Document breaking changes
- [ ] Use exact versions for production builds
- [ ] Keep devDependencies separate from dependencies

## 🎓 Learning Resources

- [PNPM Workspaces](https://pnpm.io/workspaces)
- [PNPM CLI](https://pnpm.io/cli/add)
- [Filtering](https://pnpm.io/filtering)
- [.npmrc](https://pnpm.io/npmrc)
- [Workspace Protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)

## 💡 Pro Tips

1. **Use aliases in package.json:**
```json
{
  "scripts": {
    "add:api": "pnpm --filter api add",
    "add:shared": "pnpm add -w"
  }
}
```

2. **Create installation script:**
```bash
#!/bin/bash
# install-all.sh
pnpm install
pnpm run db:generate
echo "✅ All dependencies installed!"
```

3. **Pre-commit hook:**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm run lint && pnpm run test"
    }
  }
}
```

---

**Need help?** Check the [main README](./README.md) or open an issue!

