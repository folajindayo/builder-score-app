# Molecules - Composite Components

Molecules are composite components built by combining multiple atoms together. They represent simple, reusable groups of UI elements that function together as a unit.

## Principles

- **Atomic Composition**: Built from atoms
- **Single Purpose**: Each molecule serves one specific use case
- **Reusable**: Can be used in multiple organisms
- **Self-Contained**: Manage their own state and behavior
- **Accessible**: Maintain ARIA compliance
- **Tested**: Include comprehensive tests

## Available Molecules

### Forms
- **FormField** - Label + Input/Select/Textarea + Error/Helper text
- **SearchBar** - Input + Search Icon + Clear button
- **ButtonGroup** - Multiple buttons grouped together

### Feedback
- **Alert** - Icon + Title + Description + Close button
- **Toast** - Notification message with auto-dismiss
- **EmptyState** - Icon + Title + Description + Action
- **Skeleton** - Loading placeholder

### Navigation
- **Breadcrumb** - Navigation trail with separators
- **TabItem** - Individual tab with badge
- **MenuItem** - Menu option with icon and shortcut

### Data Display
- **CardHeader** - Avatar + Title + Subtitle + Actions
- **StatCard** - Label + Value + Trend indicator
- **ListItem** - Avatar/Icon + Content + Actions
- **ProgressBar** - Label + Progress + Percentage
- **AvatarGroup** - Overlapping avatars with overflow

## Usage Example

\`\`\`tsx
import { FormField, SearchBar, Alert } from '@molecules';
import { Input, Button } from '@atoms';

function Example() {
  return (
    <div>
      <Alert
        variant="success"
        title="Success"
        description="Your changes have been saved."
      />
      
      <FormField
        label="Email"
        isRequired
        errorText="Invalid email format"
      >
        <Input type="email" placeholder="you@example.com" />
      </FormField>

      <SearchBar
        placeholder="Search..."
        onSearch={(value) => console.log(value)}
      />
    </div>
  );
}
\`\`\`

## Design Patterns

### Composition
Molecules compose atoms to create meaningful UI patterns:
- FormField = Label + Input + Text
- SearchBar = Input + IconButton
- CardHeader = Avatar + Heading + Text + Actions

### State Management
Most molecules manage their own internal state:
- SearchBar manages input value
- Toast manages auto-dismiss timer
- ProgressBar calculates percentage

### Prop Drilling
Molecules accept props for both:
1. Their own behavior
2. Passing through to child atoms

### Event Handling
Molecules can:
- Handle events internally
- Expose callbacks for parent components
- Forward events to atoms

## Testing

Each molecule should have:
- Unit tests for logic and state
- Component tests for rendering
- Interaction tests for user actions
- Integration tests with atoms
- Accessibility tests

## Next Steps

Use these molecules to build **Organisms** (complex, feature-specific components) in the next phase.
