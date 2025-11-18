#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  const out = execSync('bun --version', { stdio: 'pipe' }).toString().trim();
  console.log(`Bun detected: ${out}`);
  process.exit(0);
} catch (err) {
  console.error('Bun not found on PATH.');
  console.error('Run `npm run bun:install` (administrator privileges may be required)');
  process.exit(1);
}
