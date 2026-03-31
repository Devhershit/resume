# Complex Code Sections Explained

This document breaks down the most complex algorithms and patterns used in the portfolio.

---

## 1. Window Animation - Zoom from Source

**File**: `src/hooks/useWindowAnimation.js`

### The Problem
When you click a folder, the window appears. But where should it come from? How can it animate "from" the folder icon to its final position?

### The Solution
`getOffsetFromSource()` calculates the **distance vector** between the source and target.

```
folder icon @ (100, 50)    →    window @ (300, 200)
       Center: (115, 60)            Center: (400, 300)
       
Offset needed: (115-400, 60-300) = (-285, -240)
```

### How It Works
```javascript
// Initial state: Window at its final position but scaled to 0.1 and offset
gsap.fromTo(element, {
  opacity: 0,
  scale: 0.1,          // Tiny
  x: offset.x,         // Positioned at source
  y: offset.y,
}, {
  opacity: 1,
  scale: 1,            // Full size
  x: 0,                // Back to final position
  y: 0,
  duration: 0.62,
  ease: 'power3.out',  // Starts fast, ends slow
})
```

### Why offset.x and offset.y?
- DOM elements animated with `gsap.to()` move relative to their final position
- By setting `x: offset.x`, we move LEFT by that amount
- By setting `x: 0`, we reset to the true final position
- The animation path: small + offset → large + no-offset = effect of zooming in from source

---

## 2. Window Cascade Positioning

**File**: `src/store/windowStore.js` (lines 60-75)

### The Problem
When opening multiple windows, they should stack in a staircase pattern, not overlap completely.

### The Algorithm
```javascript
const cascadePosition = {
  x: 140 + Object.keys(state.windows).length * 24,
  y: 82 + Object.keys(state.windows).length * 16,
}
```

**Breakdown**:
- Start at **(140, 82)** for the first window
- Each additional window shifts by **+24px right, +16px down**
- After 10 windows: (140 + 240, 82 + 160) = (380, 242)

### Viewport Clamping
```javascript
const defaultPosition = {
  x: clamp(
    cascadePosition.x,
    constraints.sidePadding,                              // Min: 8px from left
    Math.max(constraints.sidePadding, 
             viewport.width - defaultSize.width - constraints.sidePadding)  // Max
  ),
  y: clamp(cascadePosition.y, constraints.topInset, ...)  // Similar for Y
}
```

**Result**: Windows never cascade off-screen.

---

## 3. Z-Index Stacking

**File**: `src/store/windowStore.js` (lines 43-48, 137-155)

### The Problem
Which window appears on top? How do we manage stacking order?

### The Solution
Every action that brings a window to focus increments a global counter:

```javascript
const nextZ = state.zCounter + 1

openWindow: () => {
  set({ zCounter: nextZ, activeWindowId: id, ... })
  // Now this window has highest z-index
}

focusWindow: (id) => {
  const nextZ = state.zCounter + 1
  set({
    zCounter: nextZ,
    activeWindowId: id,
    windows: { ..., [id]: { zIndex: nextZ } }
  })
}
```

### Why This Works
- Higher z-index = appears on top (CSS z-stacking)
- Counter only goes up, never resets
- Currently focused window always has the highest number
- Clicking any window immediately brings it to front

### Base Value
```javascript
const BASE_Z_INDEX = 40
```
This ensures windows sit **above** most UI elements (menu bar, dock usually < 40).

---

## 4. Viewport Constraint Adaptation

**File**: `src/store/windowStore.js` (lines 14-33)

### The Problem
Desktop and mobile have different safe areas:
- Desktop: Windows can occupy full viewport
- Mobile: Must avoid top menu bar (58px), bottom dock (108px)

### The Logic
```javascript
function getViewportWindowConstraints(viewport) {
  const isMobileViewport = viewport.width <= 768  // Breakpoint
  
  if (isMobileViewport) {
    return {
      horizontalInset: 28,     // Total: 14px left + 14px right
      sidePadding: 10,         // Individual side (for clamping)
      topInset: 58,            // Below menu bar
      bottomOffset: 108,       // Dock height
    }
  }
  // Desktop values...
}
```

### Applied to Window Sizing
```javascript
const maxHeight = Math.max(
  240,  // Absolute minimum
  viewport.height - constraints.bottomOffset
)
```

Example:
- **Mobile** (768px): max height = max(240, 768 - 108) = **660px**
- **Desktop** (1920px): max height = max(240, 1920 - 70) = **1850px**

---

## 5. Mobile-Only Y-Axis Dragging

**File**: `src/components/MacWindow.jsx` (lines 42-52)

### The Problem
On mobile, dragging windows left-right doesn't make sense because of smaller screen.

### The Implementation
```javascript
const handleWindowDrag = (_, data) => {
  if (isMobileViewport) {
    // Only update Y, keep X constant
    onMove(windowData.id, { x: safePosition.x, y: data.y })
    return
  }
  
  // Desktop: allow both
  onMove(windowData.id, { x: data.x, y: data.y })
}

// Also passed to Draggable
<Draggable
  axis={isMobileViewport ? 'y' : 'both'}  // Restrict to Y-axis
  ...>
```

**Result**: Mobile users can only drag windows up/down, maintaining a fixed X position.

---

## 6. Smart Lazy Loading with Named Exports

**File**: `src/App.jsx` (lines 20-28)

### The Problem
Content components use **named exports**, but `React.lazy()` expects **default exports**.

### Bad Approach ❌
```javascript
// This breaks because AboutContent is exported as:
// export { AboutContent }  (named export)
// Not: export default AboutContent
const AboutContent = lazy(() => import('./content/AboutContent'))
```

### Solution ✅
```javascript
const AboutContent = lazy(() => 
  import('./content/AboutContent').then(module => ({
    default: module.AboutContent  // Convert named → default
  }))
)
```

**How it works**:
1. Dynamic import returns module object
2. `.then()` transforms it
3. Extract named export → return as `default` property
4. `React.lazy()` receives default export it expects

---

## 7. Suspense with Invisible Fallback

**File**: `src/App.jsx` (lines 57-59)

### The Problem
User opens window → content loads → moment of delay → should show loading indicator?

### The Approach
```javascript
function LoadingFallback() {
  return null  // Return nothing!
}

<Suspense fallback={<LoadingFallback />}>
  <ContentComponent />
</Suspense>
```

### Why?
- Content typically loads within **100-300ms**
- Showing a spinner for 100ms looks janky
- Better to show nothing and let content appear seamlessly
- If load takes too long (bad network), nothing shown anyway

### Alternative (for debugging)
```javascript
function LoadingFallback() {
  return <div style={{padding: '20px'}}>Loading...</div>
}
```

---

## 8. Dock Magnify - Distance-Based Scaling

**File**: `src/hooks/useDockMagnify.js`

### The Problem
macOS dock icons grow when you hover near them. They should scale based on **proximity**, not just hover state.

### Current Implementation
```javascript
Object.values(itemRefs.current).forEach((node) => {
  const rect = node.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const distanceX = Math.abs(pointerX - centerX)
  const distanceY = Math.abs(pointerY - centerY)
  
  // Simple on/off: 1.0 or 1.3
  const isHovered = distanceX <= rect.width && distanceY <= rect.height
  const scale = isHovered ? 1.3 : 1
  
  gsap.to(node, { scale, duration: 0.2 })
})
```

### Potential Enhancement ⭐
For true macOS behavior (smooth gradient magnification):
```javascript
const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
const normalizedDistance = Math.min(1, distance / 100)  // 0-1
const scale = 1 + (0.3 * (1 - normalizedDistance))      // Smooth gradient
```

---

## 9. Pointer Detection for Mobile

**File**: `src/components/DesktopGrid.jsx` (lines 40-57)

### The Problem
How do we distinguish between:
- Desktop with mouse (click once to open)
- Mobile with touch (double-tap to open)?

### The Solution
```javascript
const viewportQuery = window.matchMedia('(max-width: 768px)')
const touchQuery = window.matchMedia('(pointer: coarse)')

const updateMode = () => {
  setIsTouchViewport(
    viewportQuery.matches &&   // Small screen AND
    touchQuery.matches         // Coarse pointer (touch)
  )
}
```

### Behavior
```javascript
const handleClick = (event) => {
  if (!isTouchViewport) return  // Ignore on desktop
  onOpenFolder(folder)(event)
}

const handleDoubleClick = (event) => {
  if (isTouchViewport) return   // Ignore on touch
  onOpenFolder(folder)(event)
}
```

**Result**:
- **Touch devices**: Single tap to open
- **Desktop**: Double-click to open (no accidental opens)

---

## 10. StoreState Derivation in Zustand

**File**: `src/store/windowStore.js` (lines 114-124)

### The Problem
When a window is closed/minimized, which window should get focus?

### The Solution
```javascript
function nextActiveWindow(windows) {
  // Filter: only open, non-minimized windows
  const candidates = Object.values(windows)
    .filter(item => item.isOpen && !item.isMinimized)
  
  if (candidates.length === 0) return null
  
  // Return the one with highest z-index (topmost visible)
  return candidates
    .sort((a, b) => b.zIndex - a.zIndex)[0].id
}

// Used in close/minimize
closeWindow: (id) => {
  const windows = { ...state.windows }
  delete windows[id]
  
  set({
    windows,
    activeWindowId: nextActiveWindow(windows)  // Auto-focus
  })
}
```

**Benefits**:
- Smart auto-focus: user's attention follows topmost window
- No orphaned state: activeWindowId always valid (or null)
- Derived state: computed on-demand, not stored

---

## Summary of Patterns

| Pattern | File | Purpose |
|---------|------|---------|
| **Offset Animation** | useWindowAnimation.js | Scale from source to target |
| **Cascade Positioning** | windowStore.js | Staircase window layout |
| **Z-Index Counter** | windowStore.js | Stacking order management |
| **Viewport Constraints** | windowStore.js | Safe areas per device |
| **Axis-Limited Dragging** | MacWindow.jsx | Mobile-friendly UX |
| **Named→Default Export** | App.jsx | Lazy load pattern fix |
| **Invisible Suspense** | App.jsx | Seamless lazy loading |
| **Distance Scaling** | useDockMagnify.js | Proximity effect |
| **Pointer Detection** | DesktopGrid.jsx | Device type detection |
| **Derived State** | windowStore.js | Smart auto-focus |

---

## Performance Considerations

### Layouts
- **Cascade calculation**: O(n) where n = number of windows
- **Clamping**: O(1) math operations
- **Lazy load**: One-time per content accessed

### Animations
- **GSAP**: Uses requestAnimationFrame (GPU-accelerated)
- **Dock magnify**: Runs on every pointer move → consider throttling

### Memory
- **Window objects**: Minimal size (~400 bytes each)
- **Chunks**: Loaded once, cached by browser

---

## Debugging These Sections

### Test Animations
```javascript
// In Grainient.jsx or MacWindow, temporarily:
gsap.set(element, { duration: 5 })  // Slow all anims 10x
```

### Check Stack Order
```javascript
// DevTools console:
document.querySelectorAll('article[style]')
  .forEach(el => console.log(el.style.zIndex))
```

### Monitor Lazy Loads
```javascript
// DevTools > Network > JS, filter by chunk
// Or check: Performance > Recording
```

### Trace Store Updates
```javascript
// In browser console:
import { useWindowStore } from './store/windowStore'
useWindowStore.subscribe((state, prevState) => {
  if (state.windows !== prevState.windows) console.log('Windows changed', state.windows)
})
```

