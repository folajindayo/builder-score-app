# Atoms - Basic UI Components

Atoms are the smallest building blocks of the design system. They are fundamental HTML elements styled with NativeWind (Tailwind CSS) and enhanced with additional functionality.

## Principles

- **Single Responsibility**: Each atom serves one specific purpose
- **Composable**: Can be combined to build more complex components
- **Accessible**: Follow WCAG guidelines with ARIA support
- **Themeable**: Support light/dark modes and customization
- **Typed**: Full TypeScript support with strict types
- **Consistent**: Follow design system tokens and patterns

## Available Atoms

### Form Elements
- **Button** - Action triggers with variants (solid, outline, ghost, link)
- **Input** - Text input with validation states
- **Textarea** - Multi-line text input
- **Checkbox** - Boolean input with label support
- **Radio** - Single choice from options
- **Select** - Dropdown selection
- **Switch** - Toggle input
- **Label** - Form field labels with required indicator

### Typography
- **Text** - Text display with size and weight variants
- **Heading** - Semantic heading levels (h1-h6)

### Media
- **Avatar** - User profile images with fallback initials
- **Image** - Images with lazy loading and error handling

### Navigation
- **Link** - Hyperlinks with external link support

### Feedback
- **Badge** - Status indicators and labels
- **Spinner** - Loading indicators

### Layout
- **Divider** - Visual separators

### Actions
- **IconButton** - Icon-only buttons

## Usage Example

\`\`\`tsx
import { Button, Input, Badge } from '@atoms';

function Example() {
  return (
    <div>
      <Badge variant="solid" colorScheme="primary">New</Badge>
      <Input placeholder="Enter text..." />
      <Button variant="solid" colorScheme="primary">
        Submit
      </Button>
    </div>
  );
}
\`\`\`

## Design Tokens

All atoms use consistent design tokens:
- **Colors**: primary, secondary, success, error, warning, info
- **Sizes**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **Spacing**: Following Tailwind's spacing scale
- **Typography**: System font stack with fallbacks
- **Borders**: Consistent border radius and width
- **Shadows**: Elevation system

## Accessibility

All atoms include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus indicators
- Screen reader support
- Semantic HTML elements

## Testing

Each atom should have:
- Unit tests for props and variants
- Accessibility tests
- Visual regression tests
- Interaction tests

## Next Steps

Use these atoms to build **Molecules** (composite components) in the next phase.
