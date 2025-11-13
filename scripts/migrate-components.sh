#!/bin/bash
# Component Migration Script
#
# Helps migrate components from old structure to new Atomic Design structure.
# Usage: ./scripts/migrate-components.sh <component-name> <target-level>
# Example: ./scripts/migrate-components.sh Button atoms

set -e

COMPONENT_NAME=$1
TARGET_LEVEL=$2

if [ -z "$COMPONENT_NAME" ] || [ -z "$TARGET_LEVEL" ]; then
  echo "Usage: $0 <component-name> <target-level>"
  echo "Example: $0 Button atoms"
  echo "Valid levels: atoms, molecules, organisms, templates"
  exit 1
fi

# Validate target level
case $TARGET_LEVEL in
  atoms|molecules|organisms|templates)
    ;;
  *)
    echo "Error: Invalid target level '$TARGET_LEVEL'"
    echo "Valid levels: atoms, molecules, organisms, templates"
    exit 1
    ;;
esac

OLD_PATH="components/${COMPONENT_NAME}.tsx"
NEW_DIR="src/presentation/components/${TARGET_LEVEL}/${COMPONENT_NAME}"
NEW_PATH="${NEW_DIR}/${COMPONENT_NAME}.tsx"

# Check if old component exists
if [ ! -f "$OLD_PATH" ]; then
  echo "Error: Component not found at $OLD_PATH"
  exit 1
fi

# Create new directory
echo "Creating directory: $NEW_DIR"
mkdir -p "$NEW_DIR"

# Copy component file
echo "Copying component file..."
cp "$OLD_PATH" "$NEW_PATH"

# Create barrel export
echo "Creating barrel export..."
cat > "${NEW_DIR}/index.ts" << EOF
/**
 * ${COMPONENT_NAME} Export
 */

export * from './${COMPONENT_NAME}';
export { default } from './${COMPONENT_NAME}';
EOF

# Create test file template
echo "Creating test file template..."
cat > "${NEW_DIR}/${COMPONENT_NAME}.test.tsx" << EOF
/**
 * ${COMPONENT_NAME} Component Tests
 */

import { render, screen } from '@testing-library/react';
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

describe('${COMPONENT_NAME}', () => {
  it('renders successfully', () => {
    render(<${COMPONENT_NAME} />);
    // Add assertions
  });

  // Add more tests
});
EOF

# Create Storybook story template
echo "Creating Storybook story template..."
cat > "${NEW_DIR}/${COMPONENT_NAME}.stories.tsx" << EOF
/**
 * ${COMPONENT_NAME} Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

const meta: Meta<typeof ${COMPONENT_NAME}> = {
  title: '${TARGET_LEVEL}/${COMPONENT_NAME}',
  component: ${COMPONENT_NAME},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${COMPONENT_NAME}>;

export const Default: Story = {
  args: {},
};

// Add more stories
EOF

echo ""
echo "✅ Migration completed!"
echo ""
echo "Component migrated to: $NEW_PATH"
echo ""
echo "Next steps:"
echo "1. Update imports in the migrated component"
echo "2. Update component to use new type definitions"
echo "3. Write tests in ${NEW_DIR}/${COMPONENT_NAME}.test.tsx"
echo "4. Write stories in ${NEW_DIR}/${COMPONENT_NAME}.stories.tsx"
echo "5. Update imports in files that use this component"
echo "6. Remove old component file: $OLD_PATH"
echo ""

