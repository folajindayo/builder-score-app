# Branch Protection Rules

This document outlines the branch protection rules and Git workflow for the Builder Score App.

## Protected Branches

### Main Branch (`main`)

The main branch is protected with the following rules:

#### Required Status Checks

The following checks must pass before merging:

- **Lint** - Code must pass ESLint checks
- **Type Check** - TypeScript compilation must succeed
- **Unit Tests** - All unit and integration tests must pass
- **E2E Tests** - End-to-end tests must pass
- **Build** - Production build must complete successfully
- **Coverage** - Code coverage must meet 70% threshold
- **Bundle Size** - Bundle size must be within limits

#### Pull Request Requirements

- **Required Approvals**: 1 approving review from code owners
- **Dismiss Stale Reviews**: Enabled - new commits dismiss previous approvals
- **Require Review from Code Owners**: Enabled
- **Restrict Push**: Only maintainers can push directly (discouraged)
- **Require Linear History**: Enabled - no merge commits
- **Require Signed Commits**: Recommended but not enforced

#### Additional Restrictions

- **Force Push**: Disabled - no force pushing to main
- **Delete Branch**: Disabled - main branch cannot be deleted
- **Allow Rebase Merge**: Enabled
- **Allow Squash Merge**: Enabled (recommended)
- **Allow Merge Commits**: Disabled

### Develop Branch (`develop`)

Similar protections as main, but with relaxed requirements:

- **Required Approvals**: 1
- **Required Status Checks**: Lint, Type Check, Unit Tests
- **Allow Force Push**: Disabled

## Git Workflow

### Feature Development

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Bug Fixes

```bash
# Create fix branch from main
git checkout main
git pull origin main
git checkout -b fix/bug-description

# Make changes and commit
git add .
git commit -m "fix: resolve bug description"

# Push and create PR
git push origin fix/bug-description
```

### Hotfixes

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Make changes and commit
git add .
git commit -m "fix: resolve critical issue"

# Fast-track review and merge
git push origin hotfix/critical-issue
```

## Branch Naming Conventions

### Feature Branches

- `feature/user-authentication`
- `feature/search-functionality`
- `feat/builder-profiles`

### Bug Fix Branches

- `fix/login-error`
- `fix/memory-leak`
- `bugfix/search-crash`

### Hotfix Branches

- `hotfix/security-patch`
- `hotfix/critical-bug`

### Documentation Branches

- `docs/update-readme`
- `docs/api-documentation`

### Refactor Branches

- `refactor/simplify-auth`
- `refactor/extract-hooks`

### Test Branches

- `test/add-integration-tests`
- `test/e2e-coverage`

### Chore Branches

- `chore/update-dependencies`
- `chore/cleanup-code`

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes (dependencies, etc.)
- `revert`: Revert previous commit

### Examples

```bash
feat: add user profile page

fix: resolve wallet connection timeout

docs: update API documentation

refactor: simplify authentication logic

test: add tests for search functionality

chore: update dependencies
```

## Merge Strategies

### Squash and Merge (Recommended)

- Combines all commits into one
- Keeps main branch history clean
- Use for most PRs

```bash
# GitHub will do this automatically when you click "Squash and Merge"
```

### Rebase and Merge

- Preserves individual commits
- Linear history
- Use for significant features

```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main
git push origin feature/my-feature --force-with-lease
# Then merge via GitHub
```

### Merge Commit (Disabled)

- Creates merge commit
- Non-linear history
- Not allowed on protected branches

## Code Owners

`.github/CODEOWNERS` file defines who must review changes to specific files:

```
# Global owners
* @maintainers

# Component owners
/components/ @frontend-team

# API owners
/app/api/ @backend-team

# Documentation owners
/docs/ @tech-writers

# Configuration owners
*.config.* @devops-team
```

## Pre-Merge Checklist

Before merging a PR:

- [ ] All CI checks pass
- [ ] Code review approved
- [ ] No merge conflicts
- [ ] Branch is up to date with main
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

## Emergency Procedures

### Hotfix Process

1. Create hotfix branch from main
2. Make minimal necessary changes
3. Fast-track review (1 hour)
4. Merge to main
5. Deploy immediately
6. Cherry-pick to develop if needed

### Reverting Changes

```bash
# Revert a PR
git revert <commit-hash>
git push origin main

# Or revert via GitHub UI
```

## Best Practices

1. **Keep Branches Short-Lived**: Merge within 1-2 days
2. **Small PRs**: Easier to review, faster to merge
3. **Up to Date**: Regularly sync with main
4. **Clean History**: Squash fixup commits
5. **Meaningful Commits**: Each commit should be logical unit
6. **Test Locally**: Run all checks before pushing

## Troubleshooting

### Cannot Push to Protected Branch

```
remote: error: GH006: Protected branch update failed
```

**Solution**: Create a PR instead of pushing directly

### Failed Status Checks

1. Check CI logs for errors
2. Fix issues locally
3. Push changes
4. Wait for checks to re-run

### Merge Conflicts

```bash
# Update your branch
git checkout feature/my-feature
git fetch origin
git rebase origin/main

# Resolve conflicts
# ... edit files ...
git add .
git rebase --continue

# Force push (with lease for safety)
git push origin feature/my-feature --force-with-lease
```

## Resources

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
- [Conventional Commits](https://www.conventionalcommits.org/)

