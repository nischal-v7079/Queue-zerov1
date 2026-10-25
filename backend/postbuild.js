import fs from 'fs';
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
fs.writeFileSync('dist/package.json', JSON.stringify({ type: 'module' }, null, 2));
