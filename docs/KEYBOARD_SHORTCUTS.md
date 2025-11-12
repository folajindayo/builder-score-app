# Keyboard Shortcuts Documentation

This document provides a comprehensive guide to all keyboard shortcuts available in the Builder Score App.

## Global Shortcuts

These shortcuts work across all pages of the application.

### Navigation
- **`/`** - Focus the search input (when available)
- **`Esc`** - Close modals, dialogs, or cancel current action
- **`?`** - Open keyboard shortcuts help dialog

### General Actions
- **`Enter`** - Submit forms, activate buttons, or confirm actions
- **`Tab`** - Navigate forward through focusable elements
- **`Shift + Tab`** - Navigate backward through focusable elements
- **Arrow Keys** - Navigate within lists, tables, or menus (context-dependent)

## Page-Specific Shortcuts

### Home Page
- **`/`** - Focus search (if search input is available)

### Search Page
- **`/`** - Focus the main search input
- **`Esc`** - Clear search or close filters
- **`Enter`** - Submit search
- **Arrow Keys** - Navigate through search results

### Leaderboard Page
- **Arrow Keys** - Navigate through table rows
- **`Enter`** - Open builder profile modal for selected row
- **`Esc`** - Close modals or clear filters
- **`/`** - Focus search/filter inputs

## Component-Specific Shortcuts

### Modals and Dialogs
- **`Esc`** - Close the modal
- **`Tab`** - Navigate through modal content (focus trapped)
- **`Shift + Tab`** - Navigate backward (focus trapped)

### Tables
- **Arrow Up/Down** - Navigate between rows
- **Arrow Left/Right** - Navigate between columns (if applicable)
- **`Enter`** - Activate the selected row (e.g., open profile)
- **`Space`** - Select/deselect row (if selection is enabled)

### Dropdowns and Menus
- **Arrow Up/Down** - Navigate through options
- **`Enter`** - Select the highlighted option
- **`Esc`** - Close the dropdown/menu

### Forms
- **`Tab`** - Move to next field
- **`Shift + Tab`** - Move to previous field
- **`Enter`** - Submit form (if single-line input) or move to next field (if multi-line)
- **`Esc`** - Cancel or reset form

## Accessibility Notes

### Screen Reader Support
All keyboard shortcuts are designed to work seamlessly with screen readers. The application follows ARIA best practices for keyboard navigation.

### Focus Management
- Focus is automatically managed when opening/closing modals
- Focus traps prevent keyboard navigation from leaving modal dialogs
- Skip links are available for quick navigation to main content

### Visual Indicators
- Focused elements are clearly highlighted with visible focus rings
- Keyboard shortcuts are displayed in tooltips where applicable
- The keyboard shortcuts help dialog (press `?`) shows all available shortcuts

## Browser Compatibility

These keyboard shortcuts work in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Customization

Currently, keyboard shortcuts are not customizable. Future versions may include:
- User-configurable shortcut keys
- Shortcut conflict detection
- Custom shortcut profiles

## Troubleshooting

### Shortcuts Not Working
1. Ensure the page has finished loading
2. Check if a modal or dialog is blocking keyboard input
3. Verify that the element you're trying to interact with is focusable
4. Try refreshing the page

### Conflicts with Browser Shortcuts
Some browser shortcuts may conflict with application shortcuts:
- **`Ctrl/Cmd + K`** - Browser search (may conflict with app search)
- **`Ctrl/Cmd + W`** - Close tab (browser default, cannot be overridden)
- **`F5`** - Refresh page (browser default)

The application avoids overriding critical browser shortcuts.

## Implementation Details

Keyboard shortcuts are implemented using:
- React event handlers (`onKeyDown`)
- Custom hooks (`useKeyboardNavigation`)
- Focus management utilities (`useFocusManagement`, `FocusTrap`)
- Event listeners for global shortcuts

For developers: See `lib/use-keyboard-navigation.ts` and `components/KeyboardShortcuts.tsx` for implementation details.

## Contributing

When adding new keyboard shortcuts:
1. Document them in this file
2. Add them to the `KeyboardShortcuts` component on relevant pages
3. Ensure they don't conflict with existing shortcuts
4. Test with screen readers for accessibility
5. Add appropriate ARIA labels and announcements

