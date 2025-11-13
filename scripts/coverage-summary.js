#!/usr/bin/env node

/**
 * Script to display a pretty coverage summary
 * Run after: npm run test:coverage
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_FILE = path.join(__dirname, '../coverage/coverage-summary.json');

function getColorCode(percentage) {
  if (percentage >= 80) return '\x1b[32m'; // Green
  if (percentage >= 60) return '\x1b[33m'; // Yellow
  return '\x1b[31m'; // Red
}

function formatPercentage(value) {
  const percentage = value.toFixed(2);
  const colorCode = getColorCode(value);
  const resetCode = '\x1b[0m';
  return `${colorCode}${percentage}%${resetCode}`;
}

function displayCoverageSummary() {
  if (!fs.existsSync(COVERAGE_FILE)) {
    console.error('Coverage summary file not found. Run npm run test:coverage first.');
    process.exit(1);
  }

  const coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));
  const total = coverage.total;

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║           Test Coverage Summary                ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  console.log('  Category       Coverage     Covered/Total');
  console.log('  ─────────────────────────────────────────────');
  console.log(
    `  Statements     ${formatPercentage(total.statements.pct)}     ${total.statements.covered}/${total.statements.total}`
  );
  console.log(
    `  Branches       ${formatPercentage(total.branches.pct)}     ${total.branches.covered}/${total.branches.total}`
  );
  console.log(
    `  Functions      ${formatPercentage(total.functions.pct)}     ${total.functions.covered}/${total.functions.total}`
  );
  console.log(
    `  Lines          ${formatPercentage(total.lines.pct)}     ${total.lines.covered}/${total.lines.total}`
  );
  console.log('');

  const averageCoverage =
    (total.statements.pct + total.branches.pct + total.functions.pct + total.lines.pct) / 4;

  console.log(`  Overall Coverage: ${formatPercentage(averageCoverage)}`);
  console.log('');

  // Check if coverage meets threshold
  const threshold = 70;
  const meetsThreshold = averageCoverage >= threshold;

  if (meetsThreshold) {
    console.log(`  ✓ Coverage meets threshold of ${threshold}%`);
  } else {
    console.log(`  ✗ Coverage below threshold of ${threshold}%`);
    console.log(`    Need ${(threshold - averageCoverage).toFixed(2)}% more coverage`);
  }

  console.log('\n  Full report: coverage/lcov-report/index.html\n');

  return meetsThreshold;
}

try {
  const success = displayCoverageSummary();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error('Error reading coverage summary:', error.message);
  process.exit(1);
}
