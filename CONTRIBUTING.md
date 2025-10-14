# Contributing Guide

Thank you for your interest in contributing! This guide will help you get started.

## 🔧 Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/logs-management-microservice.git
   cd logs-management-microservice
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Database**
   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

## 🌿 Branch Naming

Use descriptive branch names:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring

Example: `feat/add-user-authentication`

## 💻 Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

3. **Test Your Changes**
   ```bash
   pnpm run test
   pnpm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feat/your-feature
   ```

## 📝 Commit Message Format

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Testing
- `chore:` - Maintenance

Example: `feat: add user authentication endpoint`

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain test coverage above 80%

```bash
pnpm run test:cov
```

## 📋 Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Keep functions small and focused

## 🔍 Pull Request Guidelines

- Provide clear PR description
- Link related issues
- Ensure CI/CD checks pass
- Request review from maintainers
- Address review comments promptly

## ❓ Questions?

Feel free to open an issue for any questions or clarifications.

