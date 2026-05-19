# PHASE 2: VERIFICATION & TESTING GUIDE

---

## QUICK START

### 1. Install & Run

```bash
# Navigate to project
cd "d:\My Projects\VS Code Projects\Website\Arhans-Portfolio(vite)"

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected Output**:

```
VITE v4.5.13  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 2. Browser Testing

### Visit `http://localhost:5173/`

**You should see**:

```
┌─────────────────────────────────────┐
│     DESKTOP WALLPAPER VISIBLE       │  ← Dark gradient background
│     (dark slate with glow effects)  │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│      ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐│  ← Dock at bottom
│      │👨‍💻││🚀 ││⚡││💻││📹││📬 ││     (6 app icons)
│      └───┘└───┘└───┘└───┘└───┘└───┘│
└─────────────────────────────────────┘
```

---

## 3. Functionality Testing

### Test Window Operations

**Step 1: Open About Window**

- Click 👨‍💻 icon on dock
- Expected: Window appears with "About Me" content
- Title: "About Arhan" with 👨‍💻 icon
- Position: Centered approximately at (50, 50)

**Step 2: Open Projects Window**

- Click 🚀 icon on dock
- Expected: New window opens
- It should cascade slightly offset from first window
- Title: "Portfolio Projects"

**Step 3: Test Window Controls**

On any window titlebar, you should see:

```
[Title] ──────────────────────── [−] [□] [×]
                                  │   │  │
                           minimize│   │  └─ close (red)
                                   │   └─ maximize
                                   └─ minimize
```

**Minimize test**:

- Click − button
- About window disappears
- Open About again → it reappears (not duplicated)

**Maximize test**:

- Click □ button
- Window expands to fill screen
- Click □ again → returns to original size

**Close test**:

- Click × button
- Window closes
- Can reopen from dock

**Step 4: Dragging Test**

- Click and drag titlebar
- Window follows your mouse
- Stops at screen edges (constrained)
- Click another window → first loses focus

**Step 5: Focus Test**

- Open all 6 apps
- Click on different windows
- Each window should come to front
- Shadow should brighten on focused window

---

## 4. Console Testing

### No Errors Expected

Open DevTools (F12) → Console tab

You should see:

- ✅ No errors
- ✅ No warnings about Jotai
- ✅ Zustand store working

```javascript
// You can test the store manually:
// In console, paste:

import { useWindowStore } from "./src/store/windowStore.js";
const store = useWindowStore.getState();
console.log(store.windows); // Should show array of open windows
console.log(store.focusStack); // Should show focus order
```

---

## 5. Build Testing

### Test Production Build

```bash
npm run build
```

**Expected Output**:

```
dist/index.html                0.41 kB
dist/assets/index-xxx.js       ~280 kB
dist/assets/index-xxx.css      ~45 kB

✓ built in 1.23s
```

### Check Build Size

```bash
# Show what was added/removed
npm run build 2>&1 | grep -E "kB|added|removed"
```

**Expected Changes**:

- Total size should be ≤ 330KB (was 350KB)
- Zustand adds ~2.2KB
- Jotai removed (~6KB)
- Net savings ~3.8KB

### Preview Build

```bash
npm run preview
```

Visit http://localhost:4173/ - should work identically to dev

---

## 6. Component Testing

### Test Terminal App

```
1. Click 💻 icon
2. Window opens with green terminal text
3. Type: help
4. Press Enter
5. See: "Available commands: about, projects, skills, contact, clear"
6. Type: clear
7. Press Enter
8. Terminal clears
```

### Test Contact App

```
1. Click 📬 icon
2. Window opens with form
3. Form has: Email, Message, Send button
4. Has: GitHub, LinkedIn, Twitter links
```

---

## 7. Store Testing

### Check Window Store

```javascript
// In browser console:

// Check current state
useWindowStore.getState().windows;
// Should return array of open windows

// Check focus stack
useWindowStore.getState().focusStack;
// Should return [id1, id2, id3, ...] (last = focused)

// Try an operation
useWindowStore.getState().openWindow({
  app: "about",
  title: "Test",
});
// Should open new About window

// Check z-index
useWindowStore.getState().getWindowZIndex("about-main");
// Should return number like 100, 101, 102, etc
```

---

## 8. Performance Testing

### Check Performance Mode

In console:

```javascript
import { useThreePerformance } from "./src/three/hooks/useThreePerformance.js";
const perf = useThreePerformance();
console.log(perf);

// Output should show:
// {
//   enabled: true,
//   isLowEnd: false/true,
//   isMobile: false/true,
//   shadows: true/false,
//   antialias: true/false,
//   dpr: 1.5 or 1,
//   precision: "mediump" or "lowp"
// }
```

### Test Frame Rate

In DevTools → Performance tab:

1. Record performance
2. Open a window
3. Drag it around
4. Stop recording
5. Check FPS (should be 50-60)

---

## 9. Theme Testing

### Test Dark/Light Theme

```javascript
// In console:

// Get current theme
useThemeStore.getState().theme;
// Returns: "dark" or "light"

// Toggle theme
useThemeStore.getState().toggleTheme();

// Check HTML element
document.documentElement.classList;
// Should see: "dark" or "light" class
```

---

## 10. Preserved Functionality Testing

### Test Existing Routes

**Resume Page**:

```
Navigate to: http://localhost:5173/resume
Expected: Resume page loads (white background)
No errors
Works identically to before
```

**Blog Page**:

```
Navigate to: http://localhost:5173/blog/any-id
Expected: BlogDetail component loads
No errors
Works identically to before
```

**404 Page**:

```
Navigate to: http://localhost:5173/nonexistent
Expected: NotFound component shows
No errors
```

---

## 11. Expected Errors (SHOULD NOT OCCUR)

### ❌ If You See These, Something's Wrong:

```
ERROR: Cannot find module 'jotai'
→ Fix: jotai should be removed from package.json

ERROR: useWindowStore is not a function
→ Fix: Check imports in components

ERROR: App component missing
→ Fix: Check that App.jsx is in src/

ReferenceError: zustand is not defined
→ Fix: npm install zustand

Cannot find Wallpaper component
→ Fix: Check file at src/components/desktop/Wallpaper.jsx exists
```

---

## 12. Success Checklist

**Core Architecture**:

- [ ] Desktop shell renders
- [ ] Wallpaper visible
- [ ] Dock appears at bottom
- [ ] App icons clickable

**Window System**:

- [ ] Windows open on click
- [ ] Windows can be dragged
- [ ] Multiple windows support
- [ ] Focus system works
- [ ] Z-index ordering correct
- [ ] Minimize/maximize work
- [ ] Close button removes window

**State Management**:

- [ ] Zustand store working
- [ ] Theme store working
- [ ] App registry working
- [ ] No Jotai errors

**Code Quality**:

- [ ] No console errors
- [ ] No console warnings
- [ ] Build completes
- [ ] Build size acceptable

**Preserved Features**:

- [ ] /resume works
- [ ] /blog/:id works
- [ ] 404 page works
- [ ] All old components available

---

## 13. Troubleshooting

### Problem: "Module not found: lucide-react"

**Solution**: `npm install lucide-react`

### Problem: Empty dock (no icons)

**Solution**: Check DOCK_APPS in src/utils/constants.js

### Problem: Windows don't open

**Solution**: Check browser console for errors, verify app registry in src/components/apps/index.js

### Problem: Cannot drag windows

**Solution**: Check useDragWindow hook is attached to titlebar

### Problem: Old code still running

**Solution**:

- Hard refresh: Ctrl+Shift+R
- Clear cache: DevTools → Network → Disable cache
- Rebuild: npm run build && npm run preview

---

## 14. Expected File Sizes

After `npm install`:

```
node_modules/:
zustand/               ~50 KB
(jotai should be gone)

dist/:
index.js               ~280 KB
index.css              ~45 KB
Total:                 ~325 KB (from ~350 KB)
```

---

## FINAL VERIFICATION COMMAND

Run this to verify everything:

```bash
# One command to test all
npm run dev & \
npm run build && \
echo "✅ Phase 2 Complete!" || \
echo "❌ Build failed"
```

---

## Phase 2 Complete When

✅ npm run dev works  
✅ Desktop displays  
✅ Dock renders  
✅ Windows open/close/drag  
✅ npm run build succeeds  
✅ No console errors  
✅ Old routes (/resume, /blog/:id) work

**Then proceed to Phase 3: Desktop Shell Polish**
