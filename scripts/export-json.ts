import fs from 'node:fs';
import path from 'node:path';
import { initialDefaultData } from '../src/services/storageService';

const outDir = path.resolve('public/data');
fs.mkdirSync(outDir, { recursive: true });
const target = path.join(outDir, 'portfolio.json');

let existing: any = null;
try {
  if (fs.existsSync(target)) {
    existing = JSON.parse(fs.readFileSync(target, 'utf-8'));
  }
} catch {}

const dataToSave = {
  ...initialDefaultData,
  ...(existing || {}),
  lastUpdated: existing?.lastUpdated || new Date().toISOString(),
};

fs.writeFileSync(target, JSON.stringify(dataToSave, null, 2), 'utf-8');
console.log('✓ Successfully generated', target, 'lastUpdated:', dataToSave.lastUpdated);


