# Organisms

Organisms are relatively complex components composed of molecules, atoms, and sometimes other organisms. They form distinct sections of an interface.

## Characteristics

- **Complex Compositions**: Built from molecules and atoms
- **Distinct Sections**: Form recognizable sections of UI
- **Reusable Across Contexts**: Can be used in different pages
- **May Contain Logic**: Can have internal state and behavior
- **Context-Aware**: Often domain-specific

## Examples

- Navigation Bar
- Modal Dialog
- Data Table (with sorting, filtering, pagination)
- Form (with validation and submission)
- Card (with header, content, footer)
- Dropdown Menu
- Accordion
- Tabs
- File Upload
- Toast Notification System

## Usage Guidelines

1. **Compose from Smaller Parts**: Use molecules and atoms
2. **Encapsulate Complexity**: Hide complex behavior
3. **Provide Clear API**: Well-documented props interface
4. **Support Customization**: Allow styling and behavior overrides
5. **Accessibility**: Ensure keyboard navigation and ARIA support

## Composition Example

```typescript
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  return (
    <Portal>
      {isOpen && (
        <>
          <Overlay onClick={onClose} />
          <Dialog>
            <Header>
              <Heading>{title}</Heading>
              <CloseButton onClick={onClose} />
            </Header>
            <Content>{children}</Content>
            {footer && <Footer>{footer}</Footer>}
          </Dialog>
        </>
      )}
    </Portal>
  );
}
```

## Story Organization

Each organism story should demonstrate:
- Basic usage
- All variants and sizes
- Different content scenarios
- Interactive behavior
- Edge cases
- Accessibility features

## File Structure

```
organisms/
├── Modal/
│   ├── Modal.tsx
│   ├── components/        # Sub-components
│   │   ├── Header.tsx
│   │   ├── Content.tsx
│   │   └── Footer.tsx
│   ├── Modal.stories.tsx
│   ├── Modal.test.tsx
│   └── index.ts
└── ...
```

