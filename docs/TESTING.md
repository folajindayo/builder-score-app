# Testing Guide

This document provides information about testing in the Builder Score App.

## Test Stack

- **Unit/Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Istanbul (via Jest v8)

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Format**: `coverage/lcov.info`
- **JSON Summary**: `coverage/coverage-summary.json`

### Opening Coverage Report

```bash
# Open HTML coverage report in browser
npm run coverage:report
```

### Coverage Thresholds

The project maintains minimum coverage thresholds:

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

Tests will fail if coverage falls below these thresholds.

## Test Utilities

### Custom Matchers

Located in `__tests__/custom-matchers.ts`:

- `toBeValidEthereumAddress()` - Validates Ethereum addresses
- `toBeValidBuilderScore()` - Validates score values (0-1000)
- `toBeValidISODate()` - Validates ISO8601 date strings
- `toBeValidBuilderProfile()` - Validates builder profile objects
- `toBeValidSkill()` - Validates skill objects
- `toBeValidCredential()` - Validates credential objects

### Test Helpers

Located in `__tests__/test-helpers.ts`:

- `generateMockAddress()` - Generate mock Ethereum addresses
- `generateMockBuilderScore()` - Generate mock score data
- `generateMockCredential()` - Generate mock credentials
- `generateMockSkill()` - Generate mock skills
- `mockApiResponse()` - Mock API responses
- `mockApiError()` - Mock API errors
- `mockLocalStorage()` - Mock localStorage

## Writing Tests

### Component Tests

```typescript
import { renderWithProviders } from '@/__tests__/test-utils';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```

### Using Custom Matchers

```typescript
describe('Address Validation', () => {
  it('should validate Ethereum address', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(address).toBeValidEthereumAddress();
  });
});
```

### API Mocking

```typescript
import { mockApiResponse } from '@/__tests__/test-helpers';

describe('API Tests', () => {
  it('should fetch data', async () => {
    const mockData = { score: 800 };
    const data = await mockApiResponse(mockData, 100);
    expect(data).toEqual(mockData);
  });
});
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion phases
3. **Mock External Dependencies**: Mock API calls, external services, and browser APIs
4. **Test User Interactions**: Test components from the user's perspective
5. **Accessibility**: Include accessibility checks in component tests
6. **Coverage**: Aim for high coverage but prioritize meaningful tests
7. **Isolation**: Each test should be independent and not rely on others

## Debugging Tests

### Jest Debug

```bash
# Run specific test file
npm test -- MyComponent.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Update snapshots
npm test -- -u
```

### Playwright Debug

```bash
# Run with debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/homepage.spec.ts

# Run with headed browser
npx playwright test --headed
```

## CI/CD Integration

Tests run automatically on:

- Pull requests
- Pushes to main branch
- Pre-commit hooks (unit tests only)

Coverage reports are uploaded to CI artifacts for review.

## Test Organization

### Directory Structure

```
builder-score-app/
├── __tests__/                  # Unit and integration tests
│   ├── fixtures/               # Test data fixtures
│   ├── mocks/                  # MSW handlers and mocks
│   ├── custom-matchers.ts      # Custom Jest matchers
│   ├── test-helpers.ts         # Test utility functions
│   └── test-utils.tsx          # React Testing Library setup
├── e2e/                        # End-to-end tests
│   ├── homepage.spec.ts
│   └── search.spec.ts
├── visual-tests/               # Visual regression tests
│   ├── homepage-visual.spec.ts
│   └── components-visual.spec.ts
└── [feature]/__tests__/        # Co-located component tests
    └── ComponentName.test.tsx
```

### Naming Conventions

- **Unit/Integration Tests**: `*.test.ts` or `*.test.tsx`
- **E2E Tests**: `*.spec.ts`
- **Visual Tests**: `*-visual.spec.ts`
- **Test Utilities**: `test-*.ts` or `*-utils.ts`
- **Mocks**: `*.mock.ts` or within `__tests__/mocks/`

## Testing Patterns

### Component Testing Pattern

```typescript
import { renderWithProviders, screen, userEvent } from '@/__tests__/test-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render with default props', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Hook Testing Pattern

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(initialValue);
  });

  it('should update value', async () => {
    const { result } = renderHook(() => useMyHook());

    act(() => {
      result.current.setValue('new value');
    });

    await waitFor(() => {
      expect(result.current.value).toBe('new value');
    });
  });
});
```

### API Testing Pattern

```typescript
import { server } from '@/__tests__/mocks/server';
import { http, HttpResponse } from 'msw';

describe('API Integration', () => {
  it('should fetch data successfully', async () => {
    const response = await fetch('/api/data');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toHaveProperty('results');
  });

  it('should handle API errors', async () => {
    server.use(
      http.get('/api/data', () => {
        return HttpResponse.json({ error: 'Not found' }, { status: 404 });
      })
    );

    const response = await fetch('/api/data');
    expect(response.status).toBe(404);
  });
});
```

## Code Coverage Goals

### Minimum Thresholds

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

### Target Coverage

- Critical paths: 100%
- Business logic: 90%
- UI components: 80%
- Utility functions: 95%

### Exclusions

The following are excluded from coverage:

- Configuration files
- Test files
- Type definitions
- Generated code
- Development tools

## Continuous Improvement

### Coverage Tracking

Monitor coverage trends:

```bash
# Generate coverage badge
npm run test:coverage
```

### Test Quality Metrics

- Tests should be fast (<100ms per test)
- Tests should be independent
- Tests should be deterministic
- Tests should be meaningful

### Regular Review

- Review test failures weekly
- Update snapshots quarterly
- Refactor flaky tests immediately
- Add tests for bug fixes

## Troubleshooting Guide

### Common Issues

#### Test Timeout

```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

#### Async Issues

```typescript
// Use waitFor for async updates
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

#### Mock Issues

```typescript
// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

### Performance Issues

- Use `--maxWorkers=50%` for parallel execution
- Mock expensive operations
- Use shallow rendering when appropriate
- Clean up resources in `afterEach`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://testingjavascript.com/)
- [MSW Documentation](https://mswjs.io/docs/)
