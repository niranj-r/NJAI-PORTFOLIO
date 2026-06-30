import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.resolve('./src/assets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

async function optimize() {
  for (const file of files) {
    const inPath = path.join(dir, file);
    const outPath = path.join(dir, file.replace(/\.(png|jpe?g)$/i, '.webp'));
    console.log(`Optimizing ${file}...`);
    try {
      await sharp(inPath)
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log(`Success: ${file} -> ${outPath}`);
    } catch (err) {
      console.error(`Error with ${file}:`, err.message);
    }
  }
}

optimize();
