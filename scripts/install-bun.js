#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');

function runCommand(cmd) {
  console.log(`Running: ${cmd}`);
  const r = spawnSync(cmd, { stdio: 'inherit', shell: true });
  if (r.status !== 0) {
    throw new Error(`Command failed: ${cmd}`);
  }
}

async function main() {
  console.log('Installing Bun...');
  const platform = os.platform();
  try {
    if (platform === 'win32') {
      // Use PowerShell to invoke the install script
      console.log('Detected Windows. Using PowerShell to run bun installer.');
      const command = `powershell -NoProfile -Command "iwr https://bun.sh/install -UseBasicParsing | iex"`;
      runCommand(command);
    } else {
      // Linux/macOS
      console.log('Detected Unix-like OS. Using curl | bash installation method.');
      const command = `curl -fsSL https://bun.sh/install | bash`;
      runCommand(command);
    }

    // Verify bun installed
    console.log('Verifying bun installation...');
    runCommand('bun --version');
    console.log('Bun installed successfully.');
  } catch (err) {
    console.error('\nFailed to install bun automatically.');
    console.error('Please visit https://bun.sh for manual installation instructions.');
    console.error(err);
    process.exit(1);
  }
}

main();
