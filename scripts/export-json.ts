import fs from 'node:fs';
import path from 'node:path';
import { initialDefaultData } from '../src/services/storageService';

const outDir = path.resolve('public/data');
fs.mkdirSync(outDir, { recursive: true });
const target = path.join(outDir, 'portfolio.json');

fs.writeFileSync(target, JSON.stringify(initialDefaultData, null, 2), 'utf-8');
console.log('✓ Successfully generated', target);
