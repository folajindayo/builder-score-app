# Organisms - Complex Components

Organisms are complex, feature-specific UI components that combine atoms and molecules to form distinct sections of an interface.

## Principles

- **Feature Complete**: Organisms are complete, functional sections
- **Composed**: Built from atoms and molecules
- **Context-Specific**: Designed for specific use cases
- **Stateful**: Often manage complex state
- **Reusable**: Can be used across different templates
- **Business Logic**: May contain application logic

## Available Organisms

### Navigation
- **Navbar** - Complete navigation bar with logo, links, avatar
- **Sidebar** - Navigation sidebar with grouped sections
- **Breadcrumb** - Navigation trail (molecule, but complex)

### Data Display
- **Card** - Complete card with header, body, footer
- **DataTable** - Table with sorting, filtering, pagination
- **Tabs** - Complete tab system with content panels

### Overlays
- **Modal** - Dialog overlay with actions
- **DropdownMenu** - Dropdown menu with items and placement

### Forms
- **Form** - Complete form with validation and submission

### Pagination
- **Pagination** - Complete pagination controls

## Component Hierarchy

\`\`\`
Organisms (Complex, Feature-Specific)
├── Molecules (Composite, Single Purpose)
│   ├── Atoms (Basic, Fundamental)
│   └── Atoms
└── Molecules
    ├── Atoms
    └── Atoms
\`\`\`

## Usage Example

\`\`\`tsx
import { Card, DataTable, Modal, Form } from '@organisms';
import { FormField } from '@molecules';
import { Input, Button } from '@atoms';

function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Card
        header={{
          title: 'Users',
          subtitle: 'Manage your team members',
          actions: (
            <Button onClick={() => setIsModalOpen(true)}>
              Add User
            </Button>
          ),
        }}
      >
        <DataTable
          columns={[
            { key: 'name', header: 'Name', accessor: (row) => row.name },
            { key: 'email', header: 'Email', accessor: (row) => row.email },
          ]}
          data={users}
          onRowClick={(user) => console.log(user)}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <Form
          onSubmit={handleSubmit}
          submitButton={{ label: 'Create User' }}
        >
          <FormField label="Name" isRequired>
            <Input name="name" />
          </FormField>
          <FormField label="Email" isRequired>
            <Input name="email" type="email" />
          </FormField>
        </Form>
      </Modal>
    </div>
  );
}
\`\`\`

## Design Patterns

### Composition
Organisms use composition to build complex UIs:
- Card = CardHeader + Content + Footer
- DataTable = Table + Sorting + Pagination
- Form = FormFields + Validation + Submission
- Modal = Overlay + Dialog + Actions

### State Management
Organisms typically manage:
- UI state (open/closed, active tabs)
- Data state (table data, form values)
- Loading states
- Error states

### Props Pattern
Organisms accept:
1. **Data props**: Content to display
2. **Config props**: Behavior configuration
3. **Handler props**: Event callbacks
4. **Composition props**: Child components

### Context
Some organisms may use React Context for:
- Theming
- Authentication
- Global state

## Best Practices

### Keep Organisms Focused
Each organism should have one clear responsibility:
- ✅ DataTable handles data display
- ✅ Form handles data collection
- ❌ Don't create "god components" that do everything

### Composable Design
Make organisms work well together:
- Card can contain any content
- Modal can contain any organism
- Tabs can switch between any panels

### Accessibility
Ensure all organisms are accessible:
- Proper ARIA roles
- Keyboard navigation
- Focus management
- Screen reader support

### Performance
Optimize complex organisms:
- Memoize expensive calculations
- Virtual scrolling for large lists
- Lazy loading for modals/tabs
- Debounce user input

## Testing

Each organism should have:
- Unit tests for logic
- Integration tests with atoms/molecules
- E2E tests for user flows
- Accessibility tests
- Performance tests

## Next Steps

Use these organisms to build **Templates** (page-level layouts) in the next phase.
