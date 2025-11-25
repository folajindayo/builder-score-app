#!/bin/bash
# Import Update Script
#
# Updates component imports to use new path aliases.
# Usage: ./scripts/update-imports.sh

set -e

echo "Updating imports to use new path aliases..."

# Function to update imports in a file
update_file_imports() {
  local file=$1
  
  # Skip if file doesn't exist
  if [ ! -f "$file" ]; then
    return
  fi
  
  # Update component imports
  sed -i '' 's|from '\''@/components/|from '\''@components/|g' "$file" 2>/dev/null || true
  sed -i '' 's|from "../components/|from "@components/|g' "$file" 2>/dev/null || true
  sed -i '' 's|from "../../components/|from "@components/|g' "$file" 2>/dev/null || true
  
  # Update domain imports
  sed -i '' 's|from "../domain/|from "@domain/|g' "$file" 2>/dev/null || true
  sed -i '' 's|from "../../domain/|from "@domain/|g' "$file" 2>/dev/null || true
  
  # Update infrastructure imports
  sed -i '' 's|from "../infrastructure/|from "@infrastructure/|g' "$file" 2>/dev/null || true
  sed -i '' 's|from "../../infrastructure/|from "@infrastructure/|g' "$file" 2>/dev/null || true
}

# Find and update all TypeScript/React files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.next/*" \
  -not -path "*/build/*" \
  -not -path "*/dist/*" | while read file; do
  update_file_imports "$file"
  echo "Updated: $file"
done

echo ""
echo "✅ Import updates completed!"
echo ""
echo "Please review the changes and test the application."

