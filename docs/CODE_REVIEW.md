# Code Review Guide

This document provides guidelines for effective code reviews in the Builder Score App project.

## Code Review Principles

1. **Be Kind**: Review code, not people
2. **Be Specific**: Provide clear, actionable feedback
3. **Be Timely**: Review PRs within 24-48 hours
4. **Be Thorough**: Check for bugs, performance, and maintainability
5. **Be Collaborative**: Code review is a discussion, not a gate

## Reviewer Checklist

### Code Quality

- [ ] Code follows project coding standards
- [ ] No TypeScript `any` types used unnecessarily
- [ ] Functions are small and focused (< 100 lines)
- [ ] Files are under 500 lines
- [ ] Variable and function names are descriptive
- [ ] No commented-out code
- [ ] No console.log statements (use console.error/warn)

### Architecture & Design

- [ ] Code is in the right place (proper directory structure)
- [ ] No circular dependencies
- [ ] Appropriate design patterns used
- [ ] Component props are well-defined
- [ ] State management is appropriate
- [ ] API integration follows established patterns

### Testing

- [ ] New features have tests
- [ ] Tests are meaningful and cover edge cases
- [ ] Test coverage meets threshold (70%+)
- [ ] Tests are not flaky
- [ ] E2E tests added for critical flows
- [ ] Visual regression tests added for UI changes

### Performance

- [ ] No unnecessary re-renders
- [ ] Large lists use virtualization
- [ ] Images are optimized
- [ ] Code splitting is used appropriately
- [ ] No memory leaks
- [ ] Bundle size impact is acceptable

### Security

- [ ] No sensitive data in code
- [ ] Input validation is present
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Dependencies have no known vulnerabilities

### Accessibility

- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader tested
- [ ] Focus management is correct

### Documentation

- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Complex logic has comments
- [ ] JSDoc for public APIs
- [ ] Migration guide for breaking changes

### User Experience

- [ ] Loading states are present
- [ ] Error messages are helpful
- [ ] Success feedback is clear
- [ ] Empty states are handled
- [ ] Mobile responsive
- [ ] Works across browsers

### Git & Version Control

- [ ] Commit messages follow conventions
- [ ] PR description is clear
- [ ] No merge conflicts
- [ ] Branch is up to date with main
- [ ] No unnecessary files committed
- [ ] Git history is clean

## Review Process

### 1. Initial Review

1. Read the PR description
2. Understand the context and goal
3. Check if the approach makes sense
4. Review the file changes

### 2. Testing

1. Check out the branch locally
2. Run tests: `npm test`
3. Run linter: `npm run lint`
4. Test the feature manually
5. Check for edge cases

### 3. Provide Feedback

**Good Feedback:**
- "Consider extracting this logic into a separate function for reusability"
- "This might cause a memory leak. Let's add cleanup in useEffect"
- "Great implementation! This is much cleaner than the previous approach"

**Avoid:**
- "This is wrong"
- "Why did you do it this way?"
- "This is bad code"

### 4. Approval

- **Approve**: Code is good to merge
- **Request Changes**: Issues must be fixed before merge
- **Comment**: Feedback provided but not blocking

## Common Issues

### Over-Engineering

```typescript
// ❌ Over-engineered
class UserManagerFactoryProvider {
  createUserFactory() {
    return new UserFactory();
  }
}

// ✅ Simple and clear
function getUser(id: string): User {
  return users.find(u => u.id === id);
}
```

### Missing Error Handling

```typescript
// ❌ No error handling
async function fetchData() {
  const response = await fetch('/api/data');
  return await response.json();
}

// ✅ Proper error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### Performance Issues

```typescript
// ❌ Unnecessary re-renders
function Component({ items }) {
  return items.map(item => <Item key={Math.random()} {...item} />);
}

// ✅ Stable keys
function Component({ items }) {
  return items.map(item => <Item key={item.id} {...item} />);
}
```

## Auto-Review Tools

We use automated tools to catch common issues:

- **ESLint**: Code quality and standards
- **TypeScript**: Type safety
- **Prettier**: Code formatting
- **Tests**: Functionality verification
- **Bundle Analyzer**: Size impact
- **Lighthouse CI**: Performance

## Review Turnaround Time

| Priority | Turnaround |
|----------|------------|
| Hotfix | < 2 hours |
| High | < 24 hours |
| Normal | < 48 hours |
| Low | < 1 week |

## Handling Disagreements

1. Understand the other perspective
2. Explain your reasoning
3. Provide examples
4. Seek third opinion if needed
5. Focus on what's best for the project

## After Review

### For Authors

- Address feedback promptly
- Explain your reasoning if you disagree
- Update the PR description if scope changes
- Re-request review after changes

### For Reviewers

- Re-review after changes
- Approve if concerns are addressed
- Follow up on important points

## Resources

- [Google's Code Review Guide](https://google.github.io/eng-practices/review/)
- [Conventional Comments](https://conventionalcomments.org/)
- [How to Make Your Code Reviewer Fall in Love with You](https://mtlynch.io/code-review-love/)

