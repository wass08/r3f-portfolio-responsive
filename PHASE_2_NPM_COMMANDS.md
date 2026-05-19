# PHASE 2: QUICK START & NPM COMMANDS

## ONE-COMMAND SETUP

```bash
cd "d:\My Projects\VS Code Projects\Website\Arhans-Portfolio(vite)" && npm install && npm run dev
```

---

## STEP-BY-STEP SETUP

### Step 1: Navigate to Project

```bash
cd "d:\My Projects\VS Code Projects\Website\Arhans-Portfolio(vite)"
```

### Step 2: Install Dependencies

```bash
npm install
```

**What this does**:

- Installs Zustand (new)
- Removes Jotai (replaced)
- Updates node_modules/

**Expected time**: 30-60 seconds

**Expected output**:

```
added 1 package, removed 1 package in 45s
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output**:

```
VITE v4.5.13  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 4: Open Browser

```
Navigate to: http://localhost:5173
```

**You should see**:

- Dark wallpaper background
- Dock at bottom with 6 app icons
- Responsive interface

---

## FULL COMMAND REFERENCE

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Dependency Commands

```bash
# Install all dependencies
npm install

# Clean install (remove node_modules first)
rm -r node_modules && npm install

# List installed packages
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Verification Commands

```bash
# Check Zustand installed
npm list zustand

# Check Jotai removed
npm list jotai

# Verify build
npm run build && echo "✅ Build successful"

# List src files (Linux/Mac)
find src -type f -name "*.jsx" -o -name "*.js" | sort

# List src files (Windows PowerShell)
Get-ChildItem -Recurse src -Include "*.jsx","*.js" | Select-Object Name
```

---

## VERIFY INSTALLATION

### 1. Check Node & npm Versions

```bash
node --version
# Should output: v18.x or higher

npm --version
# Should output: 9.x or higher
```

### 2. Check Project Structure

```bash
# Windows Command Prompt
dir src\store
dir src\core
dir src\components\apps
dir src\components\windows
dir src\components\desktop
dir src\hooks\
dir src\utils\

# Linux/Mac
ls -la src/store/
ls -la src/core/
ls -la src/components/apps/
```

### 3. Check Dependencies

```bash
npm list zustand
npm list react
npm list framer-motion
npm list tailwindcss
```

---

## TROUBLESHOOTING COMMANDS

### Clear Cache & Reinstall

```bash
# Option 1: Complete fresh install
rm -r node_modules package-lock.json
npm install

# Option 2: Just clear npm cache
npm cache clean --force
npm install

# Option 3: Windows specific
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Check for Errors

```bash
# Run build to check for errors
npm run build

# If there are errors, they'll show here
# Fix them before running dev server
```

### Check Bundle Size

```bash
npm run build

# Windows - show file sizes
dir dist

# Linux/Mac - show file sizes
ls -lh dist/
```

### Debug Mode

```bash
# Start with debugging
npm run dev -- --debug

# More verbose output
npm run build -- --debug

# List what's being imported
npm run build -- --stats
```

---

## FILE VERIFICATION

### Verify All 30 Files Created

**Windows PowerShell**:

```powershell
# Count new files
@(
  "src\store\windowStore.js",
  "src\store\themeStore.js",
  "src\store\appStore.js",
  "src\core\DesktopShell.jsx",
  "src\core\DesktopEntry.jsx",
  "src\components\desktop\Wallpaper.jsx",
  "src\components\desktop\DockIcon.jsx",
  "src\components\desktop\Dock.jsx",
  "src\components\windows\Window.jsx",
  "src\components\windows\WindowTitleBar.jsx",
  "src\components\windows\WindowFrame.jsx",
  "src\components\shared\Button.jsx",
  "src\components\shared\Card.jsx",
  "src\components\apps\index.js",
  "src\components\apps\AboutApp.jsx",
  "src\components\apps\ProjectsApp.jsx",
  "src\components\apps\SkillsApp.jsx",
  "src\components\apps\TerminalApp.jsx",
  "src\components\apps\ContentApp.jsx",
  "src\components\apps\ContactApp.jsx",
  "src\hooks\useWindowManager.js",
  "src\hooks\useFocusManager.js",
  "src\hooks\useDragWindow.js",
  "src\three\hooks\useThreePerformance.js",
  "src\utils\constants.js",
  "src\utils\windowUtils.js",
  "src\utils\animations.js"
) | ForEach-Object { Test-Path $_ } | Measure-Object -Sum | Select-Object Count
```

**Expected Output**: Count = 27 (all files exist)

---

## PERFORMANCE TESTING

### Check Build Time

```bash
time npm run build
# Or on Windows:
Measure-Command { npm run build }
```

**Expected**: < 3 seconds

### Check Bundle Size

```bash
npm run build

# Show sizes
du -sh dist/*          # Linux/Mac
dir dist               # Windows

# Expected: ~320 KB total
```

### Check Dev Server Speed

```bash
npm run dev
# Measure time until "ready in X ms"
# Expected: < 500ms
```

---

## POST-INSTALLATION CHECKS

### After npm install

```bash
# ✅ Should exist:
npm list zustand      # Should show version

# ❌ Should NOT exist:
npm list jotai        # Should say "not installed"
```

### After npm run dev

```bash
# ✅ Should see in browser:
- Desktop with wallpaper
- Dock at bottom
- 6 app icons
- Can click to open windows
- Can drag windows
- Can close windows

# ❌ Should NOT see:
- Console errors
- Console warnings about Jotai
- Broken styling
- Missing icons
```

### After npm run build

```bash
# ✅ Should exist:
- dist/index.html (~0.4 KB)
- dist/assets/index-xxx.js (~280 KB)
- dist/assets/index-xxx.css (~45 KB)

# ❌ Should NOT exist:
- Build errors
- Missing chunks
- Failed minification
```

---

## ENVIRONMENT VARIABLES

If needed (currently not required for Phase 2):

```bash
# .env file (if you need it later)
VITE_API_URL=http://localhost:3001
VITE_APP_NAME="Arhan Portfolio"
```

---

## PORT CONFIGURATION

### Default Ports:

```
Development:  http://localhost:5173
Preview:      http://localhost:4173
Backend API:  http://localhost:3001
```

### Change Dev Port:

```bash
# Start on different port
npm run dev -- --port 3000

# Then visit: http://localhost:3000
```

---

## GIT COMMANDS (Optional)

```bash
# Commit Phase 2 changes
git add .
git commit -m "Phase 2: Architecture Refactoring - Desktop Shell"

# Create feature branch (if using branches)
git checkout -b feature/desktop-refactor
git add .
git commit -m "Phase 2: Complete desktop architecture"

# Sync with main
git checkout main
git merge feature/desktop-refactor
```

---

## QUICK DIAGNOSTICS

### One Command to Verify Everything:

```bash
# Windows
npm run build 2>&1 | findstr /C:"✓" /C:"built in" && echo ✅ Phase 2 Ready || echo ❌ Build Failed

# Linux/Mac
npm run build 2>&1 | grep -E "✓|built in" && echo ✅ Phase 2 Ready || echo ❌ Build Failed
```

### Check All Systems:

```bash
echo "=== Node Version ===" && node --version
echo "=== NPM Version ===" && npm --version
echo "=== Zustand Check ===" && npm list zustand 2>&1 | head -2
echo "=== Project Ready ===" && npm run build 2>&1 | tail -1
```

---

## SUCCESS INDICATORS

✅ **Phase 2 Complete When**:

```bash
npm run dev
# Page loads with:
# - Desktop visible
# - Dock at bottom
# - 6 app icons
# - No console errors
# - Can click icons to open windows
# - Can drag/close windows
```

---

## READY FOR PHASE 3?

When you see:

```
✅ Desktop shell renders
✅ Dock displays all apps
✅ Windows open/close/drag
✅ Terminal works
✅ npm run build succeeds
✅ No console errors
```

**Then proceed to: Phase 3 - Desktop Shell Polish**

---

## CONTACT SUPPORT

If you encounter issues:

1. **Check logs**: `npm run dev` (watch console)
2. **Clear cache**: `npm cache clean --force`
3. **Reinstall**: `rm -r node_modules && npm install`
4. **Rebuild**: `npm run build`
5. **Check files**: Verify all 30 files exist (see list above)

All Phase 2 files are in one of these directories:

- src/store/
- src/core/
- src/components/desktop/
- src/components/windows/
- src/components/apps/
- src/components/shared/
- src/hooks/
- src/utils/
- src/three/hooks/
