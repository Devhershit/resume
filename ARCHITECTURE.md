# Architecture Overview

This document explains the high-level architecture and data flow of the portfolio application.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      React App (App.jsx)                 │
│  - Lazy loads content components                         │
│  - Routes window content via contentMap                  │
│  - Passes store actions to children                      │
└────────────────────┬────────────────────────────────────┘
                     │ Provides windowStore context
                     │
        ┌────────────┴───────────┬─────────────────┐
        │                        │                 │
   ┌────▼─┐            ┌────────▼───┐     ┌──────▼──┐
   │MenuBar│       ┌────┤DesktopGrid ├─────┤Dock    │
   │ (UI) │       │    └────────┬────┘     └────────┘
   └──────┘       │             │
                  │    ┌────────▼─────┐
                  │    │  Windows[]   │ ← Rendered from store.windows
                  │    │ (MacWindow)  │
                  │    └──────┬───────┘
                  │           │
                  └───────────┼──────┬─────────────┬─────────────┐
                              │      │             │             │
                              │      │      ┌──────▼──────┐     │
                              │      │      │WindowLayer  │     │
                              │      │ (Z-index mgmt)     │     │
                              │      │      └──────┬──────┘     │
                              │      │             │             │
                              │      │    Renders: contentMap[id]
                              │      │       (lazy-loaded content)
                              │      │             │             │
                          ┌───▼──────▼─────────────▼─────────────▼───┐
                          │  Content Components (lazy-loaded)        │
                          │  - AboutContent                          │
                          │  - ProjectsContent                       │
                          │  - WorkExpContent                        │
                          │  - etc.                                  │
                          └────────────────────────────────────────┘
```

---

## State Management Flow

```
User Action (Click Folder)
    │
    ├─ DesktopGrid.onOpenFolder()
    │  └─ Captures event.currentTarget.getBoundingClientRect()
    │
    ├─ App.handleOpenFolder()
    │  └─ Calls openWindow({ id, title, sourceRect })
    │
    ├─ useWindowStore.openWindow()
    │  ├─ Calculates cascade position
    │  ├─ Clamps to viewport bounds
    │  ├─ Increments z-counter
    │  └─ Updates windows state
    │
    ├─ MacWindow receives prop update
    │  ├─ Re-renders with new position/size
    │  └─ useWindowAnimation hook runs
    │     └─ GSAP animates from sourceRect to final position
    │
    └─ Content loads via lazy + Suspense
       ├─ Chunk downloaded (if first time)
       ├─ Suspense boundary catches loading
       ├─ LoadingFallback={null} (invisible)
       └─ Content renders when ready
```

---

## Data Flow: Open Window

1. **User clicks folder icon** → `DesktopGrid` captures sourceRect
2. **App receives click** → `handleOpenFolder()` calls `openWindow()`
3. **Store updates** → `windows` object gains new entry
4. **Component re-renders** → `WindowLayer` iterates windows
5. **MacWindow mounts** → `useWindowAnimation` called
6. **Animation plays** → GSAP animates from source to final position
7. **Content loads** → `contentMap[id]` triggers lazy load
8. **Suspense resolves** → Content renders inside window

---

## Data Flow: Drag Window

1. **User mousedown on window** → `Draggable` activates
2. **User moves mouse** → `onDrag` callback fires continuously
3. **Store position updated** → `setWindowPosition(id, {x, y})`
4. **Position clamped** → Keeps window in viewport
5. **Store updates** → Triggers component re-render
6. **Window moves** → `Draggable` applies transform (from Draggable state)

> Note: `setWindowPosition` keeps position in sync with store for persistence.

---

## Data Flow: Close Window

1. **User clicks X button** → `MacWindow` calls `onClose()`
2. **Close animation** → `useWindowAnimation.animateClose()` runs
   - GSAP animates back to sourceRect
   - Duration: 0.34s
3. **After animation** → `setOpen(false)` passed, parent calls `closeWindow(id)`
4. **Store updates** → Window removed from `windows` object
5. **Component unmounts** → Content removed from DOM
6. **Focus shifts** → Store auto-focuses next topmost window

---

## Component Hierarchy

```
App.jsx (Root)
├── MenuBar (Shows active window title)
├── DesktopGrid (Folder icons on desktop)
│   └── FolderItem (Individual folder)
│       └── onClick → openWindow()
├── WindowLayer (Z-index manager)
│   └── MacWindow[] (One per open window)
│       ├── Draggable (from react-draggable)
│       │   └── article (window shell)
│       │       ├── .window-handle (title bar - draggable)
│       │       │   ├── MenuBar (window title)
│       │       │   └── Controls (minimize/maximize/close)
│       │       └── .window-content (scrollable content)
│       │           └── content (from contentMap)
│       └── useWindowAnimation (handles open/close anim)
│
├── Dock (Bottom app dock)
│   └── GlassSurface (WebGL glass effect)
│       └── NavButtons[]
│           ├── DockIcon
│           └── Magnify effect on hover
│
└── Grainient (Optional animated background)
    └── Canvas (OGL/WebGL)
```

---

## Key Hooks Explained

### `useWindowStore` (State Management)
- **Framework**: Zustand
- **State**: `{ windows, activeWindowId, zCounter }`
- **Actions**: `openWindow`, `closeWindow`, `focusWindow`, `minimizeWindow`, `setWindowPosition`, `setWindowSize`
- **Purpose**: Single source of truth for all window state

### `useWindowAnimation` (Opening/Closing)
- **Framework**: GSAP
- **Triggered**: On mount with sourceRect
- **Animation**: Scale 0.1 → 1, offset source → origin
- **Duration**: 0.62s (open), 0.34s (close)
- **Math**: Calculates offset from source to window center

### `useDockMagnify` (Dock Effect)
- **Mechanism**: Pointer tracking + distance calculation
- **Scale**: 1.0 normally, 1.3 when hovered
- **Animation**: GSAP timeline (0.2s)
- **Performance**: Only animates items in range

### `useClock` (Menu Bar)
- **Updates**: Every second
- **Format**: HH:MM (12-hour with AM/PM)
- **Performance**: Uses setInterval, cleans up on unmount

### `useFolderPositions` (Legacy?)
- **Note**: Check if still used in current implementation
- **Purpose**: Might handle desktop icon positioning

---

## Performance Optimizations

### 1. Code Splitting
```javascript
// Lazy load content only when needed
const AboutContent = lazy(() => import('./content/AboutContent'))
```
**Result**: ~50-60% smaller initial bundle

### 2. Vite Config Optimization
```javascript
// vite.config.js - Manual chunk splitting
manualChunks: {
  'vendor-core': ['react', 'react-dom'],
  'vendor-animation': ['gsap'],
  // ... vendor splits for better caching
}
```

### 3. Component Memoization
```javascript
// App.jsx - contentMap only recreates if dependencies change
const contentMap = useMemo(() => ({ ... }), [])
```

### 4. Suspense Boundaries
```javascript
// Content loads invisibly with null fallback
<Suspense fallback={<LoadingFallback />}>
  <ContentComponent />
</Suspense>
```

---

## Responsive Design Strategy

### Viewport Detection
```javascript
// windowStore.js
if (viewport.width <= 768) {
  // Mobile: Different constraints, Y-axis only dragging
} else {
  // Desktop: Full constraints, XY dragging
}
```

### Mobile Adaptations
- **Window sizes**: Terminal 620×420, Others 520×500
- **Desktop sizes**: Terminal 680×460, Others 560×560
- **Dragging**: Y-axis only on mobile (no left-right dragging)
- **Spacing**: Tighter insets and padding

---

## Error Handling

### AppErrorBoundary
- **Component**: `src/components/AppErrorBoundary.jsx`
- **Purpose**: Catches React errors and prevents crashes
- **Fallback**: Error message + reload button

### Try-Catch Blocks
- **localStorage access**: Wrapped in try-catch (SSR safety, private mode)
- **Window object checks**: Guards against SSR renders

---

## SEO & Meta Tags

> Note: No explicit meta tags configuration seen. Consider adding:
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Favicon
- Structured data (JSON-LD)

---

## Browser Compatibility

### Supported Features
- ✅ CSS Custom Properties (--variables)
- ✅ CSS Grid & Flexbox
- ✅ WebGL (OGL, GSAP)
- ✅ Intersection Observer (for lazy loading)
- ✅ requestAnimationFrame (GSAP)

### Requires
- ES2020+ (const, arrow functions, optional chaining)
- Modern browser (Chrome, Firefox, Safari, Edge)
- WebGL support

---

## Development Workflow

### HMR (Hot Module Replacement)
```bash
npm run dev  # Watches src/ for changes
```
- CSS changes: Instant update
- Component changes: Full rebuild or HMR fallback
- Store changes: Component re-renders

### Build Process
```bash
npm run build  # Vite output → dist/
```
- Minifies JS, CSS
- Code-splits into chunks
- Optimizes images
- Generates HTML

### Testing Strategy
> Note: No automated tests seen. Consider adding:
- Unit tests (Vitest) for hooks
- E2E tests (Cypress) for user flows
- Visual regression (Chromatic)

---

## Future Enhancements

1. **TypeScript Migration**: Add type safety
2. **Testing**: Unit + E2E test suite
3. **Analytics**: Track window interactions
4. **Service Worker**: Offline support
5. **PWA**: Install as app
6. **Accessibility**: ARIA labels, keyboard navigation
7. **i18n**: Multi-language support
8. **Dark Mode**: Theme switching

---

## Debugging Tips

### Check Window Store
```javascript
// In DevTools console
useWindowStore.getState()
// Shows all windows, active window, z-counter
```

### Debug Animations
1. Set `ease: 'none'` in GSAP for instant (debugging)
2. Slow down motion: Inspector → Animations → slow-mo
3. Check GSAP timeline in console: `gsap.timeline().getChildren()`

### Lazy Load Issues
1. Check Network tab for chunk downloads
2. Verify Suspense boundaries exist
3. Check for errors in ≥90 DevTools

### Mobile Testing
1. DevTools: Toggle device toolbar (Ctrl+Shift+M)
2. Verify `isTouchViewport` state in DesktopGrid
3. Test Y-axis only dragging

---

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Build configuration, chunk splitting |
| `tailwind.config.js` | (auto) Tailwind CSS setup |
| `eslint.config.js` | Code style rules |
| `package.json` | Dependencies, scripts, metadata |
| `.gitignore` | Git exclusions |
| `index.html` | HTML entry point |

