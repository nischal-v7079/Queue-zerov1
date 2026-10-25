import fs from 'fs';
import path from 'path';

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Write dist/package.json with dependencies
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const distPkg = {
  name: pkg.name,
  version: pkg.version,
  type: 'module',
  main: 'index.js',
  dependencies: pkg.dependencies || {}
};
fs.writeFileSync('dist/package.json', JSON.stringify(distPkg, null, 2));

// Copy prisma directory and dev.db to dist/prisma so it is bundled
if (fs.existsSync('prisma')) {
  if (!fs.existsSync('dist/prisma')) {
    fs.mkdirSync('dist/prisma', { recursive: true });
  }
  const files = fs.readdirSync('prisma');
  for (const file of files) {
    try {
      fs.copyFileSync(path.join('prisma', file), path.join('dist/prisma', file));
    } catch (e) {
      console.warn(`Could not copy ${file} to dist/prisma:`, e);
    }
  }
}
