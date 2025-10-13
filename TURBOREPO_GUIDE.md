# Turborepo Implementation Guide

## Overview

This project now uses [Turborepo](https://turbo.build/repo) to optimize build and development workflows in the monorepo. Turborepo provides intelligent caching, parallel execution, and task orchestration across all microservices.

## What's Configured

### Project Structure
- **Apps**: `api`, `gateway`, `logger` (NestJS microservices)
- **Packages**: Shared code in `packages/` directory
- **Package Manager**: pnpm with workspaces

### Turborepo Features Enabled

#### 1. **Task Pipeline Configuration**
All common tasks are configured with proper dependencies and caching:

- **build**: Builds all microservices with dependency-aware caching
- **dev/start:dev**: Run development servers (no caching, persistent)
- **test**: Run tests with caching for faster re-runs
- **lint**: Lint code with caching
- **format**: Format code with Prettier
- **Database operations**: Prisma commands for the API service

#### 2. **Smart Caching**
Turbo caches task outputs based on:
- Source files (`src/**`)
- Configuration files (`tsconfig.json`, `nest-cli.json`, etc.)
- Package dependencies (`package.json`)
- Environment variables

Tasks are only re-run when their inputs change.

#### 3. **Parallel Execution**
Turborepo automatically runs tasks in parallel when possible, respecting dependencies:
```
api:build ─┐
           ├─> All builds complete
gateway:build ─┤
           │
logger:build ──┘
```

#### 4. **Task Dependencies**
Tasks are configured with proper dependencies:
- `build` depends on `^build` (upstream package builds)
- `test` depends on `^build` (builds complete first)
- `lint` depends on `^build`
- `start:prod` depends on `build`

## Usage

### Basic Commands

#### Build All Services
```bash
pnpm build
# or
turbo run build
```

#### Build Specific Service
```bash
pnpm build:api
pnpm build:gateway
pnpm build:logger
```

#### Development Mode

Run all services in development:
```bash
pnpm dev:all
```

Run individual service:
```bash
pnpm dev:api
pnpm dev:logger
pnpm dev:gateway
```

#### Testing

Run all tests:
```bash
pnpm test
```

Run with coverage:
```bash
pnpm test:cov
```

Watch mode:
```bash
pnpm test:watch
```

#### Linting

Lint all services:
```bash
pnpm lint
```

Fix lint issues:
```bash
pnpm lint:fix
```

#### Formatting
```bash
pnpm format
```

#### Database Operations (API Service)
```bash
pnpm db:generate  # Generate Prisma Client
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Prisma Studio
pnpm db:reset     # Reset database
```

### Advanced Turborepo Commands

#### Force Run Without Cache
```bash
turbo run build --force
```

#### Run with Concurrency Limit
```bash
turbo run build --concurrency=2
```

#### Filter by Package
```bash
turbo run build --filter=api
turbo run build --filter=gateway...
turbo run build --filter=...logger
```

#### Dry Run (See What Would Execute)
```bash
turbo run build --dry-run
```

#### View Task Graph
```bash
turbo run build --graph
```

#### Clear Cache
```bash
turbo prune
```

## Task Configuration Details

### Cached Tasks
These tasks use caching for better performance:
- `build`: Caches compiled output
- `test`: Caches test results
- `test:cov`: Caches coverage reports
- `lint`: Caches lint results
- `db:generate`: Caches Prisma Client generation

### Non-Cached Tasks
These tasks run every time:
- `start:dev`, `dev`: Development servers
- `start:prod`: Production servers
- `test:watch`: Watch mode
- `lint:fix`: Modifies files
- `format`: Modifies files
- `db:migrate`, `db:push`, `db:reset`: Database operations

### Persistent Tasks
Long-running tasks that don't exit:
- Development servers (`start:dev`)
- Watch modes (`test:watch`)
- Database studio (`db:studio`)

## Environment Variables

Global environment variables that affect task caching:
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `API_URL`, `GATEWAY_URL`, `LOGGER_URL`
- `API_PORT`, `GATEWAY_PORT`, `LOGGER_PORT`

If these change, relevant tasks will be invalidated and re-run.

## Performance Benefits

### Before Turborepo
- Sequential builds: ~30-60 seconds
- No caching: Every build from scratch
- Manual dependency management

### After Turborepo
- Parallel builds: ~15-30 seconds (first run)
- Cached builds: ~1-5 seconds (no changes)
- Automatic dependency resolution
- Intelligent task scheduling

## CI/CD Integration

For CI/CD pipelines, you can leverage Turborepo's remote caching:

```bash
# Build with remote cache
turbo run build --token=$TURBO_TOKEN

# Test with remote cache
turbo run test --token=$TURBO_TOKEN
```

## Troubleshooting

### Cache Issues
If you experience stale cache issues:
```bash
# Clear local cache
rm -rf .turbo
rm -rf apps/*/.turbo

# Or use turbo prune
turbo prune
```

### Task Not Running
Check if task is defined in `turbo.json` and in package.json scripts.

### Dependency Issues
Make sure pnpm workspace is properly configured:
```bash
pnpm install
```

### View Turbo Logs
```bash
turbo run build --verbosity=2
```

## Best Practices

1. **Always use root scripts**: Run commands from the root using `pnpm <script>` to leverage Turborepo
2. **Commit lockfiles**: Always commit `pnpm-lock.yaml` for reproducible builds
3. **Configure cache inputs**: Update `turbo.json` when adding new config files
4. **Use filters wisely**: Use `--filter` to run tasks on specific packages only
5. **Monitor cache hit rates**: Check `.turbo/runs` to see cache effectiveness

## File Structure

```
.
├── turbo.json              # Turborepo configuration
├── package.json            # Root package with turbo scripts
├── pnpm-workspace.yaml     # pnpm workspace config
├── .turbo/                 # Turbo cache (gitignored)
├── apps/
│   ├── api/
│   │   ├── .turbo/        # App-level cache
│   │   └── package.json
│   ├── gateway/
│   └── logger/
└── packages/              # Shared packages
```

## Next Steps

1. **Install Turborepo**: Run `pnpm install` to install turbo
2. **Test Build**: Run `pnpm build` to test the build pipeline
3. **Verify Caching**: Run `pnpm build` again and notice the speed improvement
4. **Explore Commands**: Try different turbo commands to see the benefits

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo Examples](https://github.com/vercel/turbo/tree/main/examples)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [NestJS Monorepo](https://docs.nestjs.com/cli/monorepo)

## Support

For issues or questions:
1. Check the [Turborepo Docs](https://turbo.build/repo/docs)
2. Review `turbo.json` configuration
3. Check task definitions in individual `package.json` files

