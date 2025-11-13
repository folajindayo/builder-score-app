# Molecules

Molecules are simple groups of atoms that function together as a unit. They are the smallest compositions in our design system.

## Characteristics

- **Composed of Atoms**: Built from multiple atomic components
- **Single Responsibility**: Serve one specific purpose
- **Reusable**: Used in multiple contexts
- **Context-Aware**: May have some domain knowledge

## Examples

- FormField (Label + Input + HelperText + ErrorMessage)
- SearchBar (Input + Button + Icon)
- SocialLink (Icon + Link)
- InputGroup (Label + Input + Button)
- Rating (Multiple Star Icons)
- Breadcrumb Item (Link + Separator)
- MenuItem (Icon + Text + Badge)

## Usage Guidelines

1. **Combine Atoms**: Use existing atoms as building blocks
2. **Keep it Simple**: Don't make molecules too complex
3. **Single Purpose**: Each molecule should do one thing
4. **Props Interface**: Clear and well-documented props
5. **Variants**: Support different visual variants

## Composition Example

```typescript
export function FormField({
  label,
  error,
  helperText,
  required,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="form-field">
      <Label required={required}>{label}</Label>
      <Input {...inputProps} error={!!error} />
      {helperText && <HelperText>{helperText}</HelperText>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
```

## Story Organization

Each molecule story should show:
- Basic usage
- With different atom variants
- Different states (normal, error, disabled)
- Real-world examples

## File Structure

```
molecules/
├── FormField/
│   ├── FormField.tsx
│   ├── FormField.stories.tsx
│   ├── FormField.test.tsx
│   └── index.ts
└── ...
```

