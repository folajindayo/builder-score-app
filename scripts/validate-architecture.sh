#!/bin/bash
# Architecture Validation Script
#
# Validates that the Clean Architecture boundaries are respected.
# Usage: ./scripts/validate-architecture.sh

set -e

echo "==================================="
echo "  Architecture Validation"
echo "==================================="
echo ""

VIOLATIONS_FOUND=0

# Check domain layer doesn't import infrastructure or presentation
echo "Checking domain layer boundaries..."
DOMAIN_VIOLATIONS=$(grep -r "from.*infrastructure\|from.*presentation\|import.*react\|import.*next" src/domain 2>/dev/null | wc -l | tr -d ' ')

if [ "$DOMAIN_VIOLATIONS" -gt 0 ]; then
  echo "❌ Domain layer violations found: $DOMAIN_VIOLATIONS"
  grep -r "from.*infrastructure\|from.*presentation\|import.*react\|import.*next" src/domain 2>/dev/null || true
  VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + DOMAIN_VIOLATIONS))
else
  echo "✅ Domain layer: No violations"
fi

echo ""

# Check infrastructure layer doesn't import presentation
echo "Checking infrastructure layer boundaries..."
INFRA_VIOLATIONS=$(grep -r "from.*presentation\|import.*react\|import.*next" src/infrastructure 2>/dev/null | wc -l | tr -d ' ')

if [ "$INFRA_VIOLATIONS" -gt 0 ]; then
  echo "❌ Infrastructure layer violations found: $INFRA_VIOLATIONS"
  grep -r "from.*presentation\|import.*react\|import.*next" src/infrastructure 2>/dev/null || true
  VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + INFRA_VIOLATIONS))
else
  echo "✅ Infrastructure layer: No violations"
fi

echo ""

# Check atomic design hierarchy (atoms can't import molecules, organisms, templates)
echo "Checking Atomic Design hierarchy..."
ATOM_VIOLATIONS=$(grep -r "from.*molecules\|from.*organisms\|from.*templates\|from.*features" src/presentation/components/atoms 2>/dev/null | wc -l | tr -d ' ')

if [ "$ATOM_VIOLATIONS" -gt 0 ]; then
  echo "❌ Atom hierarchy violations found: $ATOM_VIOLATIONS"
  grep -r "from.*molecules\|from.*organisms\|from.*templates\|from.*features" src/presentation/components/atoms 2>/dev/null || true
  VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + ATOM_VIOLATIONS))
else
  echo "✅ Atoms: No hierarchy violations"
fi

echo ""
echo "==================================="

if [ $VIOLATIONS_FOUND -eq 0 ]; then
  echo "✅ Architecture validation passed!"
  echo "==================================="
  exit 0
else
  echo "❌ Found $VIOLATIONS_FOUND architecture violations"
  echo "==================================="
  exit 1
fi

