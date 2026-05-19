const fs = require('fs');
const path = require('path');

function scanDirRecursive(dir, exts = ['.jpg', '.jpeg', '.png', '.webp']) {
  const out = [];
  if (!fs.existsSync(dir)) return out;

  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === '__MACOSX' || e.name.startsWith('._')) {
        continue;
      }

      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.isFile()) {
        if (exts.includes(path.extname(e.name).toLowerCase())) {
          out.push(`/${path.relative(path.join(process.cwd(), 'public'), full).replace(/\\/g, '/')}`);
        }
      }
    }
  }

  walk(dir);
  return [...new Set(out)];
}

function writeJson(targetPath, data) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
}

const publicDir = path.join(process.cwd(), 'public');
const wallpapersDir = path.join(publicDir, 'wallpapers', 'iClarified-macOS-Tahoe-Wallpaper');
const photosDir = path.join(publicDir, 'photos');

const wallpapers = scanDirRecursive(wallpapersDir);
const photos = scanDirRecursive(photosDir);

writeJson(path.join(process.cwd(), 'src', 'generated', 'wallpapers.json'), wallpapers);
writeJson(path.join(process.cwd(), 'src', 'generated', 'photos.json'), photos);

console.log('Generated manifests: ', {
  wallpapers: wallpapers.length,
  photos: photos.length,
});
