#!/bin/bash
# Migration Progress Tracker
#
# Tracks the progress of component migration to new structure.
# Usage: ./scripts/migration-progress.sh

set -e

echo "==================================="
echo "   Component Migration Progress"
echo "==================================="
echo ""

# Count old components
OLD_COMPONENTS=$(find components -maxdepth 1 -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')

# Count new components by level
ATOMS=$(find src/presentation/components/atoms -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
MOLECULES=$(find src/presentation/components/molecules -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
ORGANISMS=$(find src/presentation/components/organisms -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
TEMPLATES=$(find src/presentation/components/templates -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')

MIGRATED=$((ATOMS + MOLECULES + ORGANISMS + TEMPLATES))
TOTAL=$((OLD_COMPONENTS + MIGRATED))

if [ $TOTAL -eq 0 ]; then
  PERCENTAGE=0
else
  PERCENTAGE=$((MIGRATED * 100 / TOTAL))
fi

echo "Old Structure:"
echo "  Components remaining: $OLD_COMPONENTS"
echo ""
echo "New Structure:"
echo "  Atoms:      $ATOMS"
echo "  Molecules:  $MOLECULES"
echo "  Organisms:  $ORGANISMS"
echo "  Templates:  $TEMPLATES"
echo "  Total:      $MIGRATED"
echo ""
echo "Progress: $MIGRATED / $TOTAL ($PERCENTAGE%)"
echo ""

# Show progress bar
BAR_LENGTH=50
FILLED=$((PERCENTAGE * BAR_LENGTH / 100))
EMPTY=$((BAR_LENGTH - FILLED))

printf "["
printf "%${FILLED}s" | tr ' ' '='
printf "%${EMPTY}s" | tr ' ' '-'
printf "]\n"

echo ""

# List remaining components
if [ $OLD_COMPONENTS -gt 0 ]; then
  echo "Components to migrate:"
  find components -maxdepth 1 -name "*.tsx" 2>/dev/null | sed 's|components/||' | sed 's|\.tsx||' | sort
fi

