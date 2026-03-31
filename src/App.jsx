import { useEffect, useMemo, useState, lazy, Suspense } from 'react'
import { MenuBar } from './components/MenuBar'
import { DesktopGrid } from './components/DesktopGrid'
import { Dock } from './components/Dock'
import bgOffImage from '../icons/mainport.webp'
import phoneMainImage from '../icons/phone-main.webp'
import { WindowLayer } from './components/WindowLayer'
import { useWindowStore } from './store/windowStore'

/**
 * LAZY LOADING STRATEGY
 * ====================
 *
 * Content components are lazy-loaded to reduce initial bundle size.
 * Each content module (About, Projects, etc.) is only loaded when
 * the user actually opens that window.
 *
 * Performance Impact:
 * - Initial bundle: ~120-150KB (was ~300KB)
 * - Each content chunk: ~50-100KB (loaded on-demand)
 * - Time saved on page load: ~1-2 seconds
 *
 * User Experience:
 * - Content loads invisibly with LoadingFallback={null}
 * - No loading indicator (Suspense fallback is transparent)
 * - Window appears instantly, content flows in
 */

// Lazy load Grainient (only needed if animated background enabled)
const Grainient = lazy(() => import('./components/Grainient'))

// Lazy load all content components - loaded only when window opens
// Using .then() wrapper to handle named vs default exports
const AboutContent = lazy(() => import('./content/AboutContent').then(m => ({ default: m.AboutContent })))
const ProjectsContent = lazy(() => import('./content/ProjectsContent').then(m => ({ default: m.ProjectsContent })))
const WorkExpContent = lazy(() => import('./content/WorkExpContent').then(m => ({ default: m.WorkExpContent })))
const ResumeContent = lazy(() => import('./content/ResumeContent').then(m => ({ default: m.ResumeContent })))
const ContactContent = lazy(() => import('./content/ContactContent').then(m => ({ default: m.ContactContent })))
const SocialsContent = lazy(() => import('./content/SocialsContent').then(m => ({ default: m.SocialsContent })))
const TerminalContent = lazy(() => import('./content/TerminalContent').then(m => ({ default: m.TerminalContent })))
const PhotosContent = lazy(() => import('./content/PhotosContent').then(m => ({ default: m.PhotosContent })))
const SafariContent = lazy(() => import('./content/SafariContent').then(m => ({ default: m.SafariContent })))
const LaunchpadContent = lazy(() => import('./content/LaunchpadContent').then(m => ({ default: m.LaunchpadContent })))

/**
 * Fallback component shown while lazy content loads.
 * Set to null (invisible) for seamless UX.
 * Return <div>Loading...</div> for debugging.
 */
function LoadingFallback() {
  return null // Invisible fallback - content appears when ready
}

const TITLES = {
  launchpad: 'Launchpad Hub',
  about: 'About Me',
  projects: 'Projects',
  'work-exp': 'Work Experience',
  resume: 'Resume',
  socials: 'Socials',
  contact: 'Contact Me',
  safari: 'Certification',
  photos: 'Photos',
  terminal: 'Terminal',
}

const ENABLE_ANIMATED_BACKGROUND = false

function App() {
  const [isBackgroundEnabled] = useState(() => {
    try {
      if (typeof window === 'undefined') return true
      const stored = window.localStorage.getItem('grainient-enabled')
      return stored !== '0'
    } catch {
      return true
    }
  })

  const windows = useWindowStore((state) => state.windows)
  const activeWindowId = useWindowStore((state) => state.activeWindowId)
  const openWindow = useWindowStore((state) => state.openWindow)
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const focusWindow = useWindowStore((state) => state.focusWindow)
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
  const toggleMaximize = useWindowStore((state) => state.toggleMaximize)
  const setWindowPosition = useWindowStore((state) => state.setWindowPosition)
  const setWindowSize = useWindowStore((state) => state.setWindowSize)

  const activeWindowTitle = windows[activeWindowId]?.title

  /**
   * CONTENT ROUTER - Dynamic content selection by window ID
   * ======================================================
   *
   * Maps window IDs to lazy-loaded React components wrapped in Suspense.
   *
   * Why useMemo?
   * - Prevents re-creating JSX on every render
   * - Suspense boundaries only set up once
   * - Improves performance for multi-window apps
   *
   * How it works:
   * 1. User clicks folder (e.g., "Projects")
   * 2. openWindow({ id: 'projects', ... }) called
   * 3. WindowLayer calls renderContent('projects')
   * 4. contentMap['projects'] returns <Suspense><ProjectsContent /></Suspense>
   * 5. Suspense loads ProjectsContent chunk and renders it
   */
  const contentMap = useMemo(
    () => ({
      about: <Suspense fallback={<LoadingFallback />}><AboutContent /></Suspense>,
      projects: <Suspense fallback={<LoadingFallback />}><ProjectsContent /></Suspense>,
      'work-exp': <Suspense fallback={<LoadingFallback />}><WorkExpContent /></Suspense>,
      resume: <Suspense fallback={<LoadingFallback />}><ResumeContent /></Suspense>,
      socials: <Suspense fallback={<LoadingFallback />}><SocialsContent /></Suspense>,
      contact: <Suspense fallback={<LoadingFallback />}><ContactContent /></Suspense>,
      safari: <Suspense fallback={<LoadingFallback />}><SafariContent /></Suspense>,
      photos: <Suspense fallback={<LoadingFallback />}><PhotosContent /></Suspense>,
      terminal: <Suspense fallback={<LoadingFallback />}><TerminalContent /></Suspense>,
      launchpad: <Suspense fallback={<LoadingFallback />}><LaunchpadContent /></Suspense>,
    }),
    [],
  )

  /**
   * Opens a window when user clicks a folder.
   * Captures source element's bounding rect for animation.
   */
  const handleOpenFolder = (folder) => (event) => {
    if (!folder) return
    event.preventDefault()
    event.stopPropagation()
    const sourceRect = event.currentTarget.getBoundingClientRect()
    openWindow({ id: folder.id, title: folder.title, sourceRect })
  }

  const handleDockClick = (item, sourceRect) => {
    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
      return
    }

    if (item.id === 'launchpad') {
      openWindow({ id: 'launchpad', title: TITLES.launchpad, sourceRect })
      return
    }

    if (item.id === 'terminal') {
      openWindow({ id: 'terminal', title: TITLES.terminal, sourceRect })
      return
    }

    if (item.id === 'photos') {
      openWindow({ id: 'photos', title: TITLES.photos, sourceRect })
      return
    }

    if (item.id === 'safari') {
      openWindow({ id: 'safari', title: TITLES.safari, sourceRect })
      return
    }

    if (item.id === 'contact') {
      openWindow({ id: 'contact', title: TITLES.contact, sourceRect })
    }
  }

  const renderContent = (id) => contentMap[id] ?? null

  const isAnimatedBackgroundActive = ENABLE_ANIMATED_BACKGROUND && isBackgroundEnabled

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return
      if (event.key !== 'Escape') return
      if (!activeWindowId) return
      closeWindow(activeWindowId)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeWindowId, closeWindow])

  useEffect(() => {
    try {
      window.localStorage.setItem('grainient-enabled', isBackgroundEnabled ? '1' : '0')
    } catch {
      // Ignore storage write failures (private mode / blocked storage).
    }
  }, [isBackgroundEnabled])

  return (
    <main
      className="app-shell desktop-wallpaper relative h-svh w-full overflow-hidden text-slate-900"
      style={{
        '--desktop-wallpaper-image': `url(${bgOffImage})`,
        '--phone-wallpaper-image': `url(${phoneMainImage})`,
        '--desktop-wallpaper-position': 'center center',
        '--phone-wallpaper-position': 'center top',
      }}
    >
      {isAnimatedBackgroundActive && (
        <div className="absolute inset-0">
          <Suspense fallback={<div className="h-full w-full" />}>
            <Grainient
              className="h-full w-full"
              timeSpeed={0.25}
              colorBalance={0.0}
              warpStrength={1.0}
              warpFrequency={5.0}
              warpSpeed={2.0}
              warpAmplitude={50.0}
              blendAngle={0.0}
              blendSoftness={0.05}
              rotationAmount={500.0}
              noiseScale={2.0}
              grainAmount={0.1}
              grainScale={2.0}
              grainAnimated
              contrast={1.5}
              gamma={1.0}
              saturation={1.0}
              centerX={0.0}
              centerY={0.0}
              zoom={0.9}
              color1="#FF9FFC"
              color2="#5227FF"
              color3="#B19EEF"
            />
          </Suspense>
        </div>
      )}
      {!isAnimatedBackgroundActive && (
        <div className="wallpaper-image-layer pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat" />
      )}
      <div className="wallpaper-overlay-layer pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_85%_8%,rgba(255,255,255,0.12),transparent_40%),linear-gradient(180deg,rgba(3,7,18,0.16),rgba(3,7,18,0.22))]" />

      <MenuBar activeWindowTitle={activeWindowTitle} />

      <DesktopGrid onOpenFolder={handleOpenFolder} />

      <WindowLayer
        windows={windows}
        renderContent={renderContent}
        onFocus={focusWindow}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onToggleMaximize={toggleMaximize}
        onMove={setWindowPosition}
        onResize={setWindowSize}
      />

      <Dock openWindows={windows} onAppClick={handleDockClick} />
    </main>
  )
}

export default App






