# Atoms

Atoms are the basic building blocks of our design system. They are the smallest, most fundamental components that cannot be broken down further without losing their meaning.

## Characteristics

- **Indivisible**: Cannot be broken down into smaller UI components
- **Context-Independent**: Work in any context without dependencies
- **Highly Reusable**: Used throughout the application
- **Single Purpose**: Do one thing well

## Examples

- Button
- Input
- Label
- Icon
- Badge
- Avatar
- Text
- Heading
- Link
- Checkbox
- Radio
- Switch
- Spinner
- Divider

## Usage Guidelines

1. **Keep them simple**: Atoms should be simple and focused
2. **Make them composable**: Design atoms to work well together
3. **Document thoroughly**: Provide clear prop documentation
4. **Test extensively**: Atoms are used everywhere, test all variants
5. **Accessibility first**: Ensure WCAG compliance

## Story Organization

Each atom should have a Storybook story demonstrating:
- All variants
- All sizes
- All states (default, hover, focus, disabled, etc.)
- Accessibility features
- Usage examples

## File Structure

```
atoms/
├── Button/
│   ├── Button.tsx          # Component implementation
│   ├── Button.stories.tsx  # Storybook stories
│   ├── Button.test.tsx     # Unit tests
│   └── index.ts            # Barrel export
└── ...
```

