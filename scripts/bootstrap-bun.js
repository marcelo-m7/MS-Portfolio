#!/usr/bin/env node
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const nodePath = process.execPath;

function bunInstalled() {
  try {
    execSync('bun --version', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function runBunInstall() {
  console.log('Running `bun install` to install dependencies...');
  const r = spawnSync('bun install', { shell: true, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('bun install failed');
    process.exit(1);
  }
}

function installBun() {
  const installer = path.join(__dirname, 'install-bun.js');
  console.log('Attempting to install bun...');
  const r = spawnSync(`node "${installer}"`, { shell: true, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('bun installation script failed');
    process.exit(1);
  }
}

function main() {
  if (!bunInstalled()) {
    console.log('bun not found on system. Installing bun with our installer...');
    installBun();
  }
  if (!bunInstalled()) {
    console.error('bun is still not available after installation. Aborting.');
    process.exit(1);
  }

  runBunInstall();
  console.log('\n🎉 bun bootstrap complete. You can now run `npm run dev:bun` or `bun run dev`.');
}

main();
