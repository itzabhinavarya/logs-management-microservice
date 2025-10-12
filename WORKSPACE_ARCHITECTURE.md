# PNPM Workspace Architecture

Visual guide to understanding how the monorepo dependency management works.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ROOT WORKSPACE                              │
│                       enterprise-microservice/                       │
│                                                                       │
│  package.json (Shared Dependencies)                                  │
│  ├── @nestjs/common: ^11.1.6         ← Used by ALL services        │
│  ├── @nestjs/core: ^11.1.6           ← Used by ALL services        │
│  ├── @nestjs/platform-express: ^11.1.6                              │
│  ├── typescript: ^5.9.3              ← Build tool for ALL          │
│  ├── eslint: ^9.18.0                 ← Linter for ALL              │
│  └── prettier: ^3.4.2                ← Formatter for ALL            │
│                                                                       │
│  pnpm-workspace.yaml                                                 │
│  ├── "apps/*"    ← Includes API, Gateway, Logger                    │
│  └── "libs/*"    ← Includes shared libraries (future)               │
│                                                                       │
│  .npmrc (Configuration)                                              │
│  ├── hoist=true                      ← Move common deps to root    │
│  ├── auto-install-peers=true         ← Auto-install peers          │
│  └── symlink=true                    ← Link workspace packages      │
│                                                                       │
└───────────────────────────────────────────────────────────────────┬─┘
                                                                     │
                    ┌────────────────────────────────────────────────┘
                    │
        ┌───────────┴──────────┬──────────────────┬──────────────────┐
        │                      │                  │                  │
        ▼                      ▼                  ▼                  ▼
┌───────────────┐    ┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│  API Service  │    │Gateway Service│  │Logger Service │  │ libs/ (future)│
│  Port: 4000   │    │  Port: 3000   │  │  Port: 4001   │  │              │
├───────────────┤    ├───────────────┤  ├───────────────┤  ├──────────────┤
│ package.json  │    │ package.json  │  │ package.json  │  │  common/     │
│               │    │               │  │               │  │  config/     │
│ Dependencies: │    │ Dependencies: │  │ Dependencies: │  │  contracts/  │
│ ✓ @prisma/    │    │ ✓ http-proxy- │  │ (inherits     │  │  types/      │
│   client      │    │   middleware  │  │  from root)   │  │              │
│ ✓ class-      │    │ (inherits     │  │               │  │              │
│   validator   │    │  from root)   │  │               │  │              │
│ ✓ class-      │    │               │  │               │  │              │
│   transformer │    │               │  │               │  │              │
│               │    │               │  │               │  │              │
│ DevDeps:      │    │               │  │               │  │              │
│ ✓ prisma      │    │               │  │               │  │              │
│               │    │               │  │               │  │              │
│ + inherits    │    │ + inherits    │  │ + inherits    │  │              │
│   from root   │    │   from root   │  │   from root   │  │              │
└───────────────┘    └───────────────┘  └───────────────┘  └──────────────┘
```

## 📦 Dependency Flow

### When You Run `pnpm install`

```
1. Read pnpm-workspace.yaml
   └─> Identify workspaces: apps/*, libs/*

2. Read root package.json
   └─> Install shared dependencies to node_modules/

3. Read apps/api/package.json
   └─> Install API-specific deps
   └─> Link to shared deps in root

4. Read apps/gateway/package.json
   └─> Install Gateway-specific deps
   └─> Link to shared deps in root

5. Read apps/logger/package.json
   └─> No extra deps needed
   └─> Link to shared deps in root

6. Run postinstall hook
   └─> Execute: pnpm run db:generate
   └─> Generates Prisma client

7. Create pnpm-lock.yaml
   └─> Lock all versions for reproducibility
```

## 🔗 How Hoisting Works

### Without Hoisting (Traditional)

```
enterprise-microservice/
├── apps/
│   ├── api/
│   │   └── node_modules/
│   │       ├── @nestjs/common/      (duplicated)
│   │       ├── @nestjs/core/        (duplicated)
│   │       ├── typescript/          (duplicated)
│   │       └── @prisma/client/
│   ├── gateway/
│   │   └── node_modules/
│   │       ├── @nestjs/common/      (duplicated)
│   │       ├── @nestjs/core/        (duplicated)
│   │       ├── typescript/          (duplicated)
│   │       └── http-proxy-middleware/
│   └── logger/
│       └── node_modules/
│           ├── @nestjs/common/      (duplicated)
│           ├── @nestjs/core/        (duplicated)
│           └── typescript/          (duplicated)
```

**Problems:**
- ❌ Duplicate packages waste disk space
- ❌ Inconsistent versions possible
- ❌ Slower installation
- ❌ More complex dependency resolution

### With Hoisting (PNPM Workspaces)

```
enterprise-microservice/
├── node_modules/              ← SHARED (Hoisted)
│   ├── @nestjs/common/        ✓ Once
│   ├── @nestjs/core/          ✓ Once
│   ├── @nestjs/platform-express/ ✓ Once
│   ├── typescript/            ✓ Once
│   ├── eslint/                ✓ Once
│   ├── prettier/              ✓ Once
│   ├── reflect-metadata/      ✓ Once
│   └── rxjs/                  ✓ Once
├── apps/
│   ├── api/
│   │   └── node_modules/
│   │       ├── @prisma/client/         ✓ API only
│   │       ├── class-validator/        ✓ API only
│   │       ├── class-transformer/      ✓ API only
│   │       └── .pnpm/ ← symlinks to root
│   ├── gateway/
│   │   └── node_modules/
│   │       ├── http-proxy-middleware/  ✓ Gateway only
│   │       └── .pnpm/ ← symlinks to root
│   └── logger/
│       └── node_modules/
│           └── .pnpm/ ← symlinks to root
```

**Benefits:**
- ✅ Shared packages stored once
- ✅ Consistent versions guaranteed
- ✅ Faster installation (30-50% less time)
- ✅ Saves disk space (30-50% less)
- ✅ Clear dependency tree

## 🎯 Dependency Decision Matrix

```
┌─────────────────────────────────────────────────────────┐
│ Is package needed by ALL services?                       │
└───────────────┬─────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
       YES             NO
        │               │
        ▼               ▼
  ┌──────────┐    ┌─────────────────────────────────┐
  │ Add to   │    │ Is it needed by 2+ services?    │
  │  ROOT    │    └──────────────┬──────────────────┘
  │          │                   │
  │ pnpm add │           ┌───────┴───────┐
  │ <pkg> -w │           │               │
  └──────────┘          YES             NO
                         │               │
                         ▼               ▼
                 ┌──────────────┐  ┌──────────────┐
                 │ Consider:    │  │ Add to       │
                 │ 1. Add to    │  │ SERVICE      │
                 │    ROOT      │  │              │
                 │ 2. Create    │  │ pnpm --filter│
                 │    shared    │  │ <service> add│
                 │    library   │  │ <package>    │
                 └──────────────┘  └──────────────┘

Examples:
┌────────────────┬──────────────┬────────────────────────┐
│ Package        │ Location     │ Reason                 │
├────────────────┼──────────────┼────────────────────────┤
│ @nestjs/common │ ROOT         │ All services use       │
│ typescript     │ ROOT         │ All need to build      │
│ eslint         │ ROOT         │ All need linting       │
│ @prisma/client │ API only     │ Only API uses DB       │
│ http-proxy-*   │ Gateway only │ Only Gateway proxies   │
│ winston        │ Logger only  │ Only Logger logs files │
│ lodash         │ DEPENDS      │ If all use → ROOT      │
│                │              │ If one uses → SERVICE  │
└────────────────┴──────────────┴────────────────────────┘
```

## 🔄 Command Flow Visualization

### Adding a Dependency

```
User runs: pnpm --filter api add lodash
                    │
                    ▼
            ┌───────────────┐
            │ PNPM checks   │
            │ workspace     │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ Find 'api'    │
            │ workspace     │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Add to apps/api/  │
            │ package.json      │
            └───────┬───────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Download lodash   │
            │ to api/node_      │
            │ modules/          │
            └───────┬───────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Update pnpm-lock  │
            │ .yaml             │
            └───────────────────┘
```

### Running a Script

```
User runs: pnpm run dev:all
                    │
                    ▼
            ┌───────────────────┐
            │ Read root         │
            │ package.json      │
            └───────┬───────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Execute:          │
            │ concurrently      │
            │ "pnpm dev:api"    │
            │ "pnpm dev:logger" │
            │ "pnpm dev:gateway"│
            └───────┬───────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Start   │ │ Start   │ │ Start   │
  │ API     │ │ Logger  │ │ Gateway │
  │ :4000   │ │ :4001   │ │ :3000   │
  └─────────┘ └─────────┘ └─────────┘
```

## 📊 Workspace Relationships

```
┌────────────────────────────────────────────────────────┐
│                   ROOT WORKSPACE                        │
│                                                         │
│  Provides:                                              │
│  • Build tools (TypeScript, NestJS CLI)                │
│  • Linting (ESLint, Prettier)                          │
│  • Framework (@nestjs/*)                                │
│  • Common utilities                                     │
│                                                         │
│  Scripts:                                               │
│  • install:all                                          │
│  • dev:all                                              │
│  • build                                                │
│  • test                                                 │
│  • lint                                                 │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│    API WORKSPACE        │   │   GATEWAY WORKSPACE     │
│                         │   │                         │
│  Extends: Root          │   │  Extends: Root          │
│  + Database (Prisma)    │   │  + Proxy Middleware     │
│  + Validation           │   │                         │
│  + Transform            │   │  Routes to: API         │
│                         │   │                         │
│  Exposes:               │   │  Exposes:               │
│  • /user (CRUD)         │   │  • /api/* → API:4000    │
│  • Port 4000            │   │  • Port 3000            │
└─────────┬───────────────┘   └───────────┬─────────────┘
          │                               │
          │                               │
          ▼                               ▼
  Communicates with              Single Entry Point
      Logger (HTTP)              for Clients
          │                               │
          │                               │
          └───────────┬───────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │   LOGGER WORKSPACE      │
        │                         │
        │  Extends: Root          │
        │  + Winston              │
        │                         │
        │  Receives logs from:    │
        │  • API service          │
        │  • Other services       │
        │                         │
        │  Stores:                │
        │  • logs/combined.log    │
        │  • logs/error.log       │
        │                         │
        │  Exposes:               │
        │  • POST /logs           │
        │  • Port 4001            │
        └─────────────────────────┘
```

## 🎓 Real-World Analogy

Think of it like a **company building**:

```
┌──────────────────────────────────────────────┐
│            BUILDING (Root)                    │
│                                               │
│  Shared Resources:                            │
│  • Electricity (TypeScript)                   │
│  • Water (NestJS Framework)                   │
│  • Security (ESLint)                          │
│  • Cleaning (Prettier)                        │
│                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Office 1 │  │ Office 2 │  │ Office 3 │   │
│  │  (API)   │  │(Gateway) │  │ (Logger) │   │
│  │          │  │          │  │          │   │
│  │ Has own: │  │ Has own: │  │ Has own: │   │
│  │ • Desk   │  │ • Desk   │  │ • Desk   │   │
│  │ • Chair  │  │ • Chair  │  │ • Chair  │   │
│  │ • Files  │  │ • Files  │  │ • Files  │   │
│  │          │  │          │  │          │   │
│  │ + uses   │  │ + uses   │  │ + uses   │   │
│  │ building │  │ building │  │ building │   │
│  │ resources│  │ resources│  │ resources│   │
│  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────┘
```

- **Building** = Root workspace (shared resources)
- **Offices** = Individual services (specific needs)
- **Electricity/Water** = Shared dependencies
- **Office furniture** = Service-specific dependencies

## 📈 Installation Timeline

```
Time    Action
0s      ────▶ User runs: pnpm install
        
1s      ────▶ PNPM reads pnpm-workspace.yaml
              Identifies: apps/*, libs/*
        
2s      ────▶ Reads root package.json
              Installs: @nestjs/*, typescript, eslint, etc.
              Location: /node_modules/
        
5s      ────▶ Reads apps/api/package.json
              Installs: @prisma/client, class-validator
              Location: /apps/api/node_modules/
              Links: symlinks to root deps
        
7s      ────▶ Reads apps/gateway/package.json
              Installs: http-proxy-middleware
              Location: /apps/gateway/node_modules/
              Links: symlinks to root deps
        
8s      ────▶ Reads apps/logger/package.json
              No extra deps needed
              Links: symlinks to root deps
        
10s     ────▶ Runs postinstall hook
              Executes: pnpm run db:generate
              Generates: Prisma client
        
12s     ────▶ Creates pnpm-lock.yaml
              Locks all versions
        
13s     ────▶ ✅ Installation complete!
              All services ready
```

## 🎯 Key Takeaways

1. **One Command** = Install Everything
   ```bash
   pnpm install  # That's it!
   ```

2. **Shared = Root**, **Specific = Service**
   ```bash
   pnpm add <pkg> -w              # All services
   pnpm --filter <service> add <pkg>  # One service
   ```

3. **Hoisting Saves Space**
   - Common packages stored once
   - 30-50% disk space savings
   - Faster installations

4. **Symlinks Connect Everything**
   - Services link to root deps
   - No duplication
   - Always consistent

5. **Lock File = Consistency**
   - pnpm-lock.yaml locks versions
   - Reproducible builds
   - No version conflicts

---

**Understanding this architecture will make you 10x more productive!** 🚀

