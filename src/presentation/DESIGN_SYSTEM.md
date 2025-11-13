# Builder Score Design System

A comprehensive design system built on Atomic Design principles for the Builder Score application.

## Architecture

Our design system follows Atomic Design methodology, organizing components into five distinct categories:

### Atoms (Basic Building Blocks)
The foundational elements that can't be broken down further:
- Typography (Text, Heading)
- Form controls (Input, Button, Checkbox, Radio, Switch)
- Icons and Badges
- Basic layout (Divider, Spacer)

### Molecules (Simple Combinations)
Groups of atoms functioning together:
- Form fields (Label + Input + Helper Text)
- Search bars (Input + Button)
- Social links (Icon + Link)
- Input groups

### Organisms (Complex Components)
Distinct sections of an interface:
- Navigation bars
- Modals and Dialogs
- Data tables
- Forms
- Cards with multiple elements

### Templates (Page Layouts)
Page-level structures:
- Dashboard layout
- Profile layout
- Leaderboard layout
- Settings layout

### Features (Complete Modules)
Full-featured modules:
- Profile management
- Leaderboard functionality
- Builder search
- Score analytics

## Design Tokens

### Colors
```
Primary: #3b82f6 (blue-500)
Secondary: #8b5cf6 (purple-500)
Success: #10b981 (green-500)
Warning: #f59e0b (amber-500)
Error: #ef4444 (red-500)
Info: #06b6d4 (cyan-500)
```

### Typography
```
Font Family: Inter, system-ui, sans-serif
Font Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
Font Weights: 300, 400, 500, 600, 700
```

### Spacing
```
Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64
Unit: 0.25rem (4px)
```

### Border Radius
```
none: 0
sm: 0.125rem
md: 0.375rem
lg: 0.5rem
xl: 0.75rem
full: 9999px
```

### Breakpoints
```
xs: 0px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Component Guidelines

### Naming Conventions
- Components: PascalCase (e.g., `Button`, `InputField`)
- Props: camelCase (e.g., `onClick`, `isDisabled`)
- Variants: lowercase strings (e.g., `'primary'`, `'outline'`)

### File Structure
```
ComponentName/
├── ComponentName.tsx       # Implementation
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.test.tsx  # Unit tests
├── ComponentName.types.ts  # Type definitions (if complex)
└── index.ts               # Barrel export
```

### Props Interface
Every component should have a well-defined props interface:
```typescript
export interface ButtonProps extends BaseComponentProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
}
```

### Accessibility Requirements
- WCAG 2.1 AA compliance minimum
- Keyboard navigation support
- Screen reader support (ARIA labels)
- Focus indicators
- Color contrast ratios (4.5:1 for text)

### Testing Requirements
- Unit tests for all components
- Accessibility tests
- Visual regression tests (Storybook)
- Integration tests for complex interactions

## Usage Examples

### Importing Components
```typescript
// Import from atoms
import { Button, Input } from '@atoms';

// Import from molecules
import { FormField, SearchBar } from '@molecules';

// Import from organisms
import { Modal, DataTable } from '@organisms';
```

### Using Components
```typescript
<Button
  variant="primary"
  size="md"
  onClick={handleClick}
  disabled={isDisabled}
>
  Click Me
</Button>
```

## Best Practices

1. **Composition over Configuration**: Build complex components from simpler ones
2. **Single Responsibility**: Each component should do one thing well
3. **Reusability**: Design components to be reusable across contexts
4. **Accessibility First**: Always consider accessibility from the start
5. **Performance**: Use React.memo, useMemo, useCallback appropriately
6. **Type Safety**: Leverage TypeScript for type safety
7. **Documentation**: Document all props and usage examples
8. **Testing**: Test all components in isolation

## Contributing

When adding new components:
1. Determine the correct atomic level
2. Follow the file structure conventions
3. Write comprehensive prop documentation
4. Add Storybook stories for all variants
5. Write unit and accessibility tests
6. Update this documentation

