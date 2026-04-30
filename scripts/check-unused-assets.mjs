import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'src/assets');
const SRC_DIR = path.join(ROOT_DIR, 'src');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function checkUnusedAssets() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log('No assets directory found.');
    return;
  }

  const assets = getAllFiles(ASSETS_DIR);
  const srcFiles = getAllFiles(SRC_DIR).filter(f => !f.startsWith(ASSETS_DIR));
  
  const unusedAssets = [];

  for (const assetPath of assets) {
    const filename = path.basename(assetPath);
    // Skip fonts as they are often referenced in CSS/Config via path, not just filename
    if (assetPath.includes('/fonts/')) continue;

    let isUsed = false;
    for (const srcFile of srcFiles) {
      const content = fs.readFileSync(srcFile, 'utf8');
      if (content.includes(filename)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      unusedAssets.push(path.relative(ROOT_DIR, assetPath));
    }
  }

  if (unusedAssets.length > 0) {
    console.error('\x1b[31mUnused assets found:\x1b[0m');
    unusedAssets.forEach(asset => console.error(`  - ${asset}`));
    process.exit(1);
  } else {
    console.log('\x1b[32mNo unused assets found.\x1b[0m');
  }
}

checkUnusedAssets();
