# Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should be the name of the affected component or layer:

- **domain**: Domain layer changes
- **infrastructure**: Infrastructure layer changes  
- **presentation**: Presentation layer changes
- **atoms**: Atomic components
- **molecules**: Molecule components
- **organisms**: Organism components
- **templates**: Template components
- **features**: Feature modules

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Maximum 50 characters

### Body (Optional)

The body should include the motivation for the change and contrast this with previous behavior.

- Use the imperative, present tense
- Wrap at 72 characters
- Can use multiple lines

### Footer (Optional)

The footer should contain:

- Breaking changes (start with `BREAKING CHANGE:`)
- Issue references (e.g., `Closes #123`, `Fixes #456`)

## Examples

### Feature Addition

```
feat(atoms): add button component with variants

Add a new Button component with multiple variants:
- solid
- outline
- ghost
- link

The component supports all standard button props and
includes proper accessibility attributes.

Closes #42
```

### Bug Fix

```
fix(organisms): correct modal z-index stacking

Fix issue where modal was appearing behind other elements.
Updated z-index to use proper stacking context from design tokens.

Fixes #78
```

### Breaking Change

```
feat(infrastructure)!: change repository interface signature

Update repository interface to return Result type instead of
throwing errors, enabling better error handling.

BREAKING CHANGE: All repository methods now return Result<T, Error>
instead of Promise<T>. Update all repository implementations and
consumers to handle Result type.

Closes #156
```

### Documentation

```
docs(presentation): update atomic design guidelines

Add examples and best practices for creating molecules.
Include composition patterns and testing guidelines.
```

### Refactoring

```
refactor(domain): extract builder validation logic

Move validation logic from Builder entity to separate
validator classes following Single Responsibility Principle.
```

## Commit Message Template

To use the commit message template:

```bash
git config commit.template .gitmessage
```

This will automatically load the template when you run `git commit`.

## Enforcement

Commit messages are validated using:
- commitlint (configured in `commitlint.config.js`)
- Husky pre-commit hooks

Invalid commit messages will be rejected before they can be committed.

## Tips

1. **Keep commits atomic**: Each commit should represent one logical change
2. **Commit often**: Small, frequent commits are better than large, infrequent ones
3. **Write descriptive messages**: Future you will thank present you
4. **Reference issues**: Always reference related issues or tickets
5. **Test before committing**: Ensure tests pass before committing

