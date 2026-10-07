/* eslint-disable */
const fs = require('fs');
const path = require('path');

const binDir = path.join(__dirname, '..', 'node_modules', '.bin');
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

const bins = {
  next: '../next/dist/bin/next',
  prisma: '../prisma/build/index.js',
  tsc: '../typescript/bin/tsc',
  eslint: '../eslint/bin/eslint.js'
};

for (const [name, target] of Object.entries(bins)) {
  const cmdPath = path.join(binDir, name + '.cmd');
  const targetWin = target.replace(/\//g, '\\');
  const cmdContent = `@ECHO off\r\nnode "%~dp0\\${targetWin}" %*\r\n`;
  fs.writeFileSync(cmdPath, cmdContent, 'utf8');
}
console.log('Successfully created clean .bin wrappers for:', Object.keys(bins).join(', '));
