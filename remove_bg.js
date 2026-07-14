import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const targetDir = path.join(process.cwd(), 'public', 'cars');

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const targetHex = '#16213E';
const targetColor = hexToRgb(targetHex);
const tolerance = 35; // increased tolerance to handle anti-aliasing

async function processImages() {
  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    const filePath = path.join(targetDir, file);
    try {
      const image = await Jimp.read(filePath);
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        const dist = Math.sqrt(Math.pow(r - targetColor.r, 2) + Math.pow(g - targetColor.g, 2) + Math.pow(b - targetColor.b, 2));
        
        if (dist <= tolerance) {
          this.bitmap.data[idx + 3] = 0;
        } else if (dist <= tolerance + 15) {
          this.bitmap.data[idx + 3] = Math.floor(255 * ((dist - tolerance) / 15));
        }
      });
      await image.write(filePath);
      console.log(`Processed ${file}`);
    } catch (e) {
      console.error(`Error processing ${file}: ${e.message}`);
    }
  }
}

processImages();
