module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint --fix ${filenames.join(' ')}`,
    `npm run test -- --bail --findRelatedTests ${filenames.join(' ')}`,
  ],

  // JSON files
  '**/*.json': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
  ],

  // Markdown files
  '**/*.md': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
  ],

  // CSS files
  '**/*.css': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
  ],

  // Package.json - ensure lockfile is updated
  'package.json': () => [
    'npm install --package-lock-only',
  ],
};

