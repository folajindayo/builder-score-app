# Presentation Layer

The presentation layer contains all UI components, pages, and user interaction logic following Atomic Design principles.

## Structure

```
presentation/
├── components/
│   ├── atoms/       # Basic building blocks (Button, Input, Text)
│   ├── molecules/   # Simple combinations (FormField, SearchBar)
│   ├── organisms/   # Complex UI sections (Modal, Table, Navigation)
│   └── templates/   # Page layouts and structures
├── features/        # Feature-specific modules
├── hooks/           # Custom React hooks
├── styles/          # Global styles and themes
└── app/            # Next.js app router pages
```

## Atomic Design Hierarchy

### Atoms
- Basic UI elements that can't be broken down further
- Examples: Button, Input, Label, Icon, Badge
- Highly reusable and context-independent

### Molecules
- Simple combinations of atoms
- Examples: FormField (Label + Input), SearchBar (Input + Button)
- Single responsibility, specific functionality

### Organisms
- Complex components composed of molecules and atoms
- Examples: Navigation, Modal, DataTable, Form
- Can be reused across different contexts

### Templates
- Page-level layouts without data
- Define page structure and component arrangement
- Reusable across multiple pages

### Features
- Complete feature modules with their own components, hooks, and logic
- Examples: profile, leaderboard, builder-score
- Contain feature-specific business logic

## Principles

1. **Component Composition**: Build complex UIs from simple components
2. **Single Responsibility**: Each component has one clear purpose
3. **Reusability**: Design for reuse across the application
4. **Accessibility**: WCAG 2.1 AA compliance minimum
5. **Performance**: Optimize for rendering performance

## Guidelines

- Use TypeScript for all components
- Implement proper prop validation
- Add comprehensive JSDoc comments
- Follow NativeWind (Tailwind) styling conventions
- Ensure mobile-first responsive design
- Test components in isolation
- Document component APIs with Storybook

