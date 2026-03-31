# Developer Quick Reference

Fast lookup guide for common tasks and file locations.

---

## 📍 Where to Make Changes?

### Add a New Window Type
1. Add window to `src/data/windows.js`:
   ```javascript
   { id: 'newpage', title: 'New Page', type: 'folder' }
   ```
2. Add to FOLDER_ORDER if it's a desktop folder
3. Create content component: `src/content/NewPageContent.jsx`
4. Lazy load in `src/App.jsx`:
   ```javascript
   const NewPageContent = lazy(() => import('./content/NewPageContent').then(m => ({ default: m.NewPageContent })))
   ```
5. Add to contentMap:
   ```javascript
   newpage: <Suspense fallback={...}><NewPageContent /></Suspense>
   ```

### Change Window Appearance
- **Title bar colors**: `src/components/MacWindow.jsx` (CSS classes)
- **Size**: `src/store/windowStore.js` → `preferredSize`
- **Corner radius**: `src/components/MacWindow.jsx` → `className="rounded-xl"`

### Change Dock Icons
- **File**: `src/components/Dock.jsx`
- **Icon set**: in `dockItems` array
- **Icon images**: `icons/` folder

### Change Background
- **Animated**: Enable in `src/App.jsx` → `ENABLE_ANIMATED_BACKGROUND = true`
- **Static**: Replace images:
  - Desktop: `icons/mainport.JPG`
  - Mobile: `icons/phone-main.jpg`

### Adjust Window Animations
- **Duration**: `src/hooks/useWindowAnimation.js` → `duration: 0.62`
- **Easing**: Change `ease: 'power3.out'` to other GSAP easing
- **Scale**: Modify `scale: 0.1` for zoom size

### Change Mobile Breakpoint
- **File**: `src/store/windowStore.js` (line 16)
- **From**: `const isMobileViewport = viewport.width <= 768`
- **To**: `525` or `1024` depending on needs

---

## 🎨 Styling Guide

### Colors
**File**: `src/App.jsx` + `src/index.css` + Tailwind config

Tailwind classes used:
- `bg-white/95` → White with 95% opacity
- `text-white/95` → Text with opacity
- `rounded-xl` → Large border radius
- `gap-2` → Spacing between items

### Responsive Classes
```
sm:        640px
md:        768px (mobile breakpoint)
lg:        1024px
xl:        1280px
```

Example:
```html
<div className="h-12 sm:h-16">
  <!-- 48px height on small, 64px on larger -->
</div>
```

### Glass Effect
**File**: `src/components/GlassSurface.jsx`

Props:
- `opacity`: 0-1 (0.93 = slightly opaque)
- `distortionScale`: -180 (RGB displacement effect)
- `redOffset`, `greenOffset`, `blueOffset`: Channel shifts

---

## 🔧 Common Tasks

### Debug a Window Not Opening
1. Check browser console for errors
2. Verify window ID in `WINDOW_DEFINITIONS`
3. Check contentMap in `App.jsx` has the ID
4. Verify content component file exists
5. Check lazy import syntax (named export wrapping)

### Fix Window Dragging Issues
1. Check `MacWindow.jsx` → `Draggable` props
2. Mobile: Verify `axis={isMobileViewport ? 'y' : 'both'}`
3. Test with DevTools device emulation
4. Check `setWindowPosition()` is being called

### Optimize Bundle Size
1. Check Vite analyzer: `npm run build` (check dist/ size)
2. Verify unused imports removed
3. Check for duplicate dependencies in package.json
4. Consider splitting large content components further

### Performance Profiling
1. Open DevTools → Performance tab
2. Record interaction (open window, scroll, etc.)
3. Look for:
   - Jank (red bars in timeline)
   - Long tasks (>50ms)
   - Expensive paints
4. Check weak spots, optimize

---

## 📚 File Reference

### Core App
```
src/App.jsx              # Main component, lazy loading, content routing
src/main.jsx             # Entry point, renders React app
src/index.css            # Global styles
src/App.css              # App-specific styles (now in Tailwind)
```

### Components
```
src/components/MacWindow.jsx          # Draggable window wrapper
src/components/WindowLayer.jsx        # Z-index management
src/components/MenuBar.jsx            # Top title bar
src/components/Dock.jsx               # Bottom dock + icons
src/components/DesktopGrid.jsx        # Folder icons
src/components/Grainient.jsx          # Animated background (WebGL)
src/components/GlassSurface.jsx       # Glass effect
src/components/AppErrorBoundary.jsx   # Error handling
```

### Content (Lazy Loaded)
```
src/content/AboutContent.jsx
src/content/ProjectsContent.jsx
src/content/WorkExpContent.jsx
src/content/ResumeContent.jsx
src/content/ContactContent.jsx
src/content/SocialsContent.jsx
src/content/PhotcsContent.jsx
src/content/TerminalContent.jsx
src/content/SafariContent.jsx
```

### Hooks
```
src/hooks/useWindowAnimation.js   # Open/close animations
src/hooks/useClock.js             # Real-time clock
src/hooks/useDockMagnify.js       # Dock magnification
src/hooks/useFolderPositions.js   # Folder positioning (legacy?)
```

### State
```
src/store/windowStore.js          # Zustand state
src/data/windows.js               # Window definitions
```

### Icons
```
src/icons/DockIcons.jsx           # Icon component
src/icons/FolderIcon.jsx          # Folder icon
```

### Config
```
vite.config.js                    # Vite build config
tailwind.config.js                # Auto-generated
eslint.config.js                  # Linting
package.json                      # Dependencies
```

---

## 🚀 Build & Deploy

### Development
```bash
npm install          # First time
npm run dev          # Start dev server, HMR enabled
```

### Production
```bash
npm run build        # Create dist/ folder
npm run lint         # Check code quality
npm run preview      # Test production build locally
```

### Deploy
1. Build: `npm run build`
2. Upload `dist/` folder to hosting:
   - Vercel: Connect GitHub repo
   - Netlify: Drag-drop dist folder
   - Traditional hosting: FTP dist/

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Content not loading | Check lazy import syntax, verify file exists |
| Windows stuck off-screen | Check `setWindowPosition` clamping logic |
| Animations choppy | Check GSAP ease, reduce duration for test |
| Mobile drag not working | Verify `isTouchViewport` state in DesktopGrid |
| Dock icons not magnifying | Check pointer event listeners in Dock.jsx |
| Page very slow | Run DevTools Performance, check for long tasks |
| Bundle too large | Check import sizes, enable build analyzer |
| Storage errors | Check localStorage try-catch in App.jsx |

---

## 📊 Performance Checklist

- [ ] Initial JS bundle < 150KB
- [ ] First Contentful Paint < 1s
- [ ] Window open animation smooth (60fps)
- [ ] No console errors on load
- [ ] Mobile viewport responsive
- [ ] Dock magnify smooth on hover
- [ ] Multiple windows open without lag
- [ ] Content loads without blocker

---

## 🔍 Unit Testing Ideas

```javascript
// Test cases to add

// useWindowAnimation
- Calculates correct offset from source to target
- Animations start at scaled, offset position
- animateClose returns promise that resolves

// windowStore
- openWindow creates new window with cascade position
- focusWindow increments z-index
- setWindowPosition clamps to viewport
- closeWindow removes window and auto-focuses next
- Multiple window opens cascade correctly

// useDockMagnify
- registerItem stores DOM references
- onPointerMove scales hovered item to 1.3
- onPointerLeave resets all to 1.0

// Rendering
- Content loads via lazy + Suspense
- macOS UI renders correctly
```

---

## 💡 Pro Tips

1. **Fast Dev Loop**: Use `npm run dev` → DevTools → make changes → see HMR update
2. **Test Mobile**: DevTools → `Ctrl+Shift+M` → test immediately
3. **Check Animations**: Slow down in DevTools → Rendering → slow motion (25%)
4. **Store Debugging**: Open console → `useWindowStore.getState()` → inspect windows
5. **Color Tweaking**: Tailwind sandbox → try colors live before committing
6. **Bundle Size**: After build → check: `ls -lh dist/assets/`
7. **Cache Busting**: Vite auto-names chunks with hash, no need to manual clear
8. **VSCode Config**: Recommend ESLint + Prettier extensions for formatting

---

## 📖 Learning Resources

- **GSAP**: https://greensock.com/docs/
- **React**: https://react.dev
- **Zustand**: https://zustand.docs.pmnd.rs/
- **Tailwind**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev
- **Draggable**: https://github.com/react-grid-layout/react-draggable

---

## 📞 Getting Help

1. **Console Errors**: Copy full error → search on MDN or StackOverflow
2. **Animation Issues**: GSAP docs > Easing section
3. **Component Help**: React DevTools Profiler to trace render issues
4. **Performance**: Chrome DevTools > Performance tab record
5. **Accessibility**: Use axe DevTools extension

---

## 🎯 Quick Navigation

- **Main App**: App.jsx
- **Window Logic**: windowStore.js
- **Animation Logic**: useWindowAnimation.js
- **Styling**: Tailwind classes in components
- **Docs**: README.md, ARCHITECTURE.md, COMPLEX_CODE_EXPLAINED.md

