# Coding Standards

This document outlines the coding standards and conventions for the Builder Score App project.

## General Principles

1. **Readability First**: Code is read more often than written
2. **Consistency**: Follow established patterns
3. **Simplicity**: Prefer simple solutions over clever ones
4. **Maintainability**: Write code that's easy to change

## File Organization

### File Length Guidelines

- **Target**: 200-400 lines per file
- **Maximum**: 500 lines (hard limit)
- **Exception**: Configuration files, type definitions, generated code

### Directory Structure

```
src/
├── app/                # Next.js app directory
├── components/         # Reusable UI components
├── lib/               # Utility functions and helpers
├── types/             # TypeScript type definitions
├── config/            # Configuration files
└── __tests__/         # Test files
```

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: camelCase (`user.types.ts`)
- **Tests**: `*.test.tsx` or `*.spec.ts`
- **Constants**: UPPER_SNAKE_CASE in file name optional

## TypeScript Standards

### Type Definitions

```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad: Implicit any
function getUser(id) {
  // ...
}
```

### No Any Types

```typescript
// ✅ Good: Use specific types
function processData(data: Record<string, unknown>): void {
  // ...
}

// ❌ Bad: Using any
function processData(data: any): void {
  // ...
}
```

### Naming Conventions

```typescript
// Interfaces: PascalCase (no I prefix)
interface UserProfile {
  name: string;
}

// Type Aliases: PascalCase
type UserId = string;

// Enums: PascalCase
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}

// Constants: UPPER_CASE or camelCase
const MAX_RETRIES = 3;
const apiBaseUrl = 'https://api.example.com';

// Functions: camelCase
function calculateScore(): number {
  // ...
}
```

## React Standards

### Component Definition

```typescript
// ✅ Good: Arrow function component with explicit return type
export const UserCard = ({ user }: UserCardProps): JSX.Element => {
  return (
    <div>
      <h2>{user.name}</h2>
    </div>
  );
};

// ❌ Bad: Function declaration
export function UserCard(props) {
  return <div>{props.user.name}</div>;
}
```

### Props Definition

```typescript
// ✅ Good: Explicit interface
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

// ❌ Bad: Inline type
export const UserCard = ({ user, onEdit }: { user: any; onEdit?: any }) => {
  // ...
};
```

### Hooks Usage

```typescript
// ✅ Good: Custom hooks start with 'use'
function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  // ...
  return { user, loading, error };
}

// ✅ Good: Hooks at top level
function Component() {
  const { user } = useUserData('123');
  const [count, setCount] = useState(0);

  // Logic after hooks
  // ...
}
```

### Key Prop

```typescript
// ✅ Good: Unique, stable keys
users.map((user) => <UserCard key={user.id} user={user} />);

// ❌ Bad: Index as key
users.map((user, index) => <UserCard key={index} user={user} />);
```

## Styling Standards

### NativeWind/Tailwind CSS

```typescript
// ✅ Good: Using Tailwind classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg">
  <span className="text-lg font-semibold">Title</span>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <span style={{ fontSize: '18px' }}>Title</span>
</div>

// ❌ Bad: StyleSheet (React Native pattern)
const styles = StyleSheet.create({
  container: { padding: 16 },
});
```

### Responsive Design

```typescript
// ✅ Good: Mobile-first responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">Content</div>
```

## Function Standards

### Function Complexity

- **Maximum complexity**: 15
- **Maximum depth**: 4 nested levels
- **Maximum parameters**: 4

```typescript
// ✅ Good: Simple, focused function
function calculateDiscount(price: number, discountRate: number): number {
  return price * (1 - discountRate);
}

// ❌ Bad: Too many parameters
function createUser(
  name: string,
  email: string,
  password: string,
  age: number,
  address: string
) {
  // ...
}

// ✅ Good: Use object parameter
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  age: number;
  address: string;
}

function createUser(params: CreateUserParams) {
  // ...
}
```

### Function Length

- **Target**: < 50 lines
- **Maximum**: 100 lines
- **Break down**: Extract complex logic into smaller functions

## Error Handling

```typescript
// ✅ Good: Explicit error handling
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// ❌ Bad: Silent failures
async function fetchUserData(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return await response.json();
}
```

## Comments

### When to Comment

```typescript
// ✅ Good: Explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the API
const delay = Math.pow(2, retryCount) * 1000;

// ❌ Bad: Stating the obvious
// Set delay to 2 to the power of retryCount times 1000
const delay = Math.pow(2, retryCount) * 1000;
```

### JSDoc for Public APIs

```typescript
/**
 * Calculates the builder score based on various metrics
 * @param metrics - The metrics to calculate score from
 * @returns The calculated score (0-1000)
 * @throws {ValidationError} If metrics are invalid
 */
export function calculateBuilderScore(metrics: Metrics): number {
  // ...
}
```

## Testing Standards

- Every component should have tests
- Aim for 80% code coverage
- Test user interactions, not implementation details
- Use meaningful test descriptions

```typescript
// ✅ Good: Descriptive test
it('should display error message when login fails', async () => {
  // ...
});

// ❌ Bad: Vague test
it('works', () => {
  // ...
});
```

## Import Organization

Imports should be organized in the following order:

1. External libraries
2. Internal modules
3. Types
4. Styles

```typescript
// External libraries
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Internal modules
import { Button } from '@/components/Button';
import { formatDate } from '@/lib/utils';

// Types
import type { User } from '@/types/user';

// Styles (if any)
import styles from './Component.module.css';
```

## Commit Standards

Follow Conventional Commits:

```bash
feat: add user profile page
fix: resolve memory leak in useEffect
docs: update API documentation
style: format code with prettier
refactor: simplify user validation logic
test: add tests for authentication flow
chore: update dependencies
```

## Code Review Checklist

- [ ] Follows TypeScript best practices
- [ ] No `any` types used
- [ ] Functions are small and focused
- [ ] Files are under 500 lines
- [ ] Tests are included
- [ ] Code is self-documenting
- [ ] Error handling is present
- [ ] No console.log statements (use console.error/warn)
- [ ] Accessibility considered
- [ ] Performance implications considered

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/routing)

