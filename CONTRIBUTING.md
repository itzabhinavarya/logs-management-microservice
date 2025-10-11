# Contributing to Enterprise Microservice

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher (check with `node --version`)
- **PNPM**: v10.0.0 or higher (check with `pnpm --version`)
- **MySQL**: v8.0 or higher
- **Git**: Latest version

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/enterprise-microservice.git
cd enterprise-microservice
```

3. Add the upstream repository:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/enterprise-microservice.git
```

## Development Setup

### 1. Install Dependencies

From the root directory:

```bash
pnpm install
```

This will install dependencies for all services in the monorepo.

### 2. Environment Setup

Create `.env` files for each service:

**API Service** (`apps/api/.env`):
```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/enterprise_db"
LOGGER_URL="http://localhost:4001"
```

**Gateway Service** (`apps/gateway/.env`):
```env
PORT=3000
API_SERVICE_URL="http://localhost:4000"
```

**Logger Service** (`apps/logger/.env`):
```env
PORT=4001
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE enterprise_db;"

# Run migrations
pnpm run db:migrate
```

### 4. Verify Setup

```bash
# Build all services
pnpm run build

# Run all services in development mode
pnpm run dev:all
```

## Project Structure

```
enterprise-microservice/
├── apps/               # Microservices
│   ├── api/           # API service
│   ├── gateway/       # Gateway service
│   └── logger/        # Logger service
├── libs/              # Shared libraries
│   ├── common/        # Common utilities
│   ├── config/        # Shared configuration
│   ├── contracts/     # API contracts
│   └── types/         # Shared types
└── infra/             # Infrastructure configs
```

## Development Workflow

### Creating a New Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/user-authentication`
- `fix/database-connection-error`
- `docs/api-endpoints`

### Making Changes

1. Make your changes in your feature branch
2. Test your changes locally:
```bash
# Run linter
pnpm run lint

# Run tests
pnpm run test

# Build to check for errors
pnpm run build
```

3. Commit your changes (see [Commit Guidelines](#commit-guidelines))

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes into your main branch
git checkout main
git merge upstream/main

# Rebase your feature branch on updated main
git checkout feature/your-feature-name
git rebase main
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Define proper types, avoid `any` when possible
- Use interfaces for object shapes

### NestJS Conventions

- Follow NestJS module structure
- Use dependency injection
- Implement proper DTOs for data validation
- Use decorators appropriately

### Code Style

- Use ESLint and Prettier (configured in the project)
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in objects and arrays
- Semicolons required

### Formatting

Before committing, format your code:

```bash
pnpm run format
```

### Linting

Fix linting issues:

```bash
pnpm run lint:fix
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, configs)
- **ci**: CI/CD changes
- **build**: Build system changes

### Scope

The scope should be the name of the service or module affected:

- `api`
- `gateway`
- `logger`
- `prisma`
- `user`
- `common`
- etc.

### Examples

```
feat(api): add user profile endpoint

- Implement GET /api/user/:id/profile
- Add profile DTO and validation
- Update user service with profile logic

Closes #123
```

```
fix(logger): handle connection timeout gracefully

- Add timeout configuration
- Implement retry logic
- Add error handling for network failures

Fixes #456
```

```
docs(readme): update installation instructions

- Add Node.js version requirement
- Update environment variable examples
- Fix typos in setup section
```

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**:
```bash
pnpm run test
```

2. **Ensure linting passes**:
```bash
pnpm run lint
```

3. **Build successfully**:
```bash
pnpm run build
```

4. **Update documentation** if needed

### Creating a Pull Request

1. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template:
   - Clear title following commit conventions
   - Description of changes
   - Link to related issues
   - Screenshots if UI changes
   - Checklist completion

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe testing performed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Dependent changes merged
```

### Review Process

- At least one approval required
- Address all review comments
- Keep PRs focused and reasonably sized
- Be responsive to feedback

### After Approval

- Squash commits if requested
- Ensure CI passes
- Maintainer will merge

## Testing

### Running Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# Run tests for specific service
pnpm --filter api run test
```

### Writing Tests

- Write unit tests for all business logic
- Write E2E tests for API endpoints
- Aim for >80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Structure

```typescript
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Arrange - Setup
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      
      // Act
      const result = await service.createUser(userData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
    });
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex algorithms
- Explain "why" not "what" in comments
- Keep comments up to date

### README Updates

Update README.md when:
- Adding new features
- Changing installation process
- Modifying configuration
- Adding new scripts

### API Documentation

- Document all endpoints
- Include request/response examples
- Specify required parameters
- Note authentication requirements

## Questions or Issues?

If you have questions:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label
4. Join community discussions

## Code of Conduct

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## License

By contributing, you agree that your contributions will be licensed under the project's ISC License.

---

Thank you for contributing! 🎉

