const fs = require('fs');
const path = require('path');

function scanDir(dir, exts = ['.jpg', '.jpeg', '.png', '.webp']) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files.filter((f) => exts.includes(path.extname(f).toLowerCase())).map((f) => `/${path.relative(path.join(process.cwd(), 'public'), path.join(dir, f)).replace(/\\/g, '/')}`);
}

function writeJson(targetPath, data) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
}

const publicDir = path.join(process.cwd(), 'public');
const wallpapersDir = path.join(publicDir, 'wallpapers', 'iClarified-macOS-Tahoe-Wallpaper');
const photosDir = path.join(publicDir, 'photos');

const wallpapers = scanDir(wallpapersDir);
const photos = scanDir(photosDir);

writeJson(path.join(process.cwd(), 'src', 'generated', 'wallpapers.json'), wallpapers);
writeJson(path.join(process.cwd(), 'src', 'generated', 'photos.json'), photos);

console.log('Generated manifests: ', {
  wallpapers: wallpapers.length,
  photos: photos.length,
});
