import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Remove the outdated lockfile
const lockfilePath = path.resolve(process.cwd(), 'pnpm-lock.yaml');
if (fs.existsSync(lockfilePath)) {
  fs.unlinkSync(lockfilePath);
  console.log('[v0] Deleted outdated pnpm-lock.yaml');
}

// Regenerate the lockfile by running pnpm install
try {
  execSync('pnpm install --frozen-lockfile=false', { stdio: 'inherit' });
  console.log('[v0] Successfully regenerated pnpm-lock.yaml');
} catch (error) {
  console.error('[v0] Error regenerating lockfile:', error.message);
  process.exit(1);
}
