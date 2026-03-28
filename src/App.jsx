import { useEffect, useMemo, useState } from 'react'
import { MenuBar } from './components/MenuBar'
import { DesktopGrid } from './components/DesktopGrid'
import { Dock } from './components/Dock'
import Grainient from './components/Grainient'
import bgOffImage from '../icons/mainport.JPG'
import phoneMainImage from '../icons/phone-main.jpg'
import { WindowLayer } from './components/WindowLayer'
import { AboutContent } from './content/AboutContent'
import { ProjectsContent } from './content/ProjectsContent'
import { WorkExpContent } from './content/WorkExpContent'
import { ResumeContent } from './content/ResumeContent'
import { ContactContent } from './content/ContactContent'
import { SocialsContent } from './content/SocialsContent'
import { TerminalContent } from './content/TerminalContent'
import { PhotosContent } from './content/PhotosContent'
import { SafariContent } from './content/SafariContent'
import { useWindowStore } from './store/windowStore'

const TITLES = {
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
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(() => {
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

  const contentMap = useMemo(
    () => ({
      about: <AboutContent />,
      projects: <ProjectsContent />,
      'work-exp': <WorkExpContent />,
      resume: <ResumeContent />,
      socials: <SocialsContent />,
      contact: <ContactContent />,
      safari: <SafariContent />,
      photos: <PhotosContent />,
      terminal: <TerminalContent />,
    }),
    [],
  )

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
      openWindow({ id: 'about', title: TITLES.about, sourceRect })
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
    try {
      window.localStorage.setItem('grainient-enabled', isBackgroundEnabled ? '1' : '0')
    } catch {
      // Ignore storage write failures (private mode / blocked storage).
    }
  }, [isBackgroundEnabled])

  const handleToggleBackground = () => {
    setIsBackgroundEnabled((prev) => !prev)
  }

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
