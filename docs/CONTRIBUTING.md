# Contributing to Builder Score App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/builder-score-app.git
   cd builder-score-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Make Changes

- Write clear, maintainable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 2. Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- MyComponent.test.tsx

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 3. Lint and Format

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### 4. Commit Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes

**Examples:**

```bash
git commit -m "feat: add builder search functionality"
git commit -m "fix: resolve wallet connection issue"
git commit -m "docs: update API documentation"
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

## Pull Request Guidelines

### PR Requirements

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] PR description is clear and complete

### PR Review Process

1. Automated checks run (CI/CD)
2. Code review by maintainers
3. Address review feedback
4. Approval and merge

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define types for all function parameters and returns
- Avoid `any` types
- Use strict mode

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling

- Use NativeWind/Tailwind CSS (not StyleSheet)
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use design system tokens

### File Organization

- Keep files under 500 lines
- Aim for 200-400 lines per file
- Co-locate related files
- Use clear, descriptive names

### Testing

- Write tests for all new features
- Aim for 80%+ coverage
- Test user interactions
- Test error states
- Test accessibility

## Documentation

### Code Comments

- Comment complex logic
- Document function purposes
- Explain non-obvious decisions
- Keep comments up-to-date

### Documentation Files

- Update README for user-facing changes
- Update docs/ for developer changes
- Include examples
- Keep docs concise

## Issue Guidelines

### Bug Reports

Use the bug report template and include:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests

Use the feature request template and include:

- Problem statement
- Proposed solution
- Use cases
- Alternative approaches

## Community

### Getting Help

- Check existing documentation
- Search existing issues
- Ask in discussions
- Be patient and respectful

### Providing Help

- Answer questions in issues
- Review pull requests
- Improve documentation
- Share knowledge

## Development Tips

### Local Development

```bash
# Start dev server
npm run dev

# Run in watch mode for instant feedback
npm run test:watch

# Check types
npx tsc --noEmit
```

### Debugging

- Use React DevTools
- Use browser DevTools
- Add console logs strategically
- Use debugger statements

### Performance

- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize images
- Lazy load components

## Release Process

Maintainers handle releases:

1. Version bump
2. Changelog update
3. Git tag
4. npm publish (if applicable)
5. GitHub release

## Questions?

- Create a discussion
- Ask in pull request
- Contact maintainers

Thank you for contributing! 🎉
