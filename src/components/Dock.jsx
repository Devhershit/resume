import { useEffect, useRef, useState } from 'react'
import { useDockMagnify } from '../hooks/useDockMagnify'
import GlassSurface from './GlassSurface'
import { FolderIcon } from '../icons/FolderIcon'
import { scaleValue } from '../utils/scale'

import finderIcon from '../../icons/finder.webp'
import launchpadIcon from '../../icons/launchpad-removebg-preview.png'
import safariIcon from '../../icons/safari-ios.webp'
import photosIcon from '../../icons/ios-photos.png'
import terminalIcon from '../../icons/terminal.png'
import contactIcon from '../../icons/contact-ios.webp'
import siriIcon from '../../icons/siri.png'
import iosmusicIcon from '../../icons/iosmusic.png'
import vsIcon from '../../icons/vs.png'
import settingIcon from '../../icons/setting.png'
import albumIcon from '../../icons/album.png'
import garageBandIcon from '../../icons/GarageBand.png'

const ICON_SOURCES = {
  finder: finderIcon,
  launchpad: launchpadIcon,
  safari: safariIcon,
  photos: photosIcon,
  terminal: terminalIcon,
  contact: contactIcon,
  music: iosmusicIcon,
  vscode: vsIcon,
  setting: settingIcon,
  album: albumIcon,
  garageband: garageBandIcon,
  siri: siriIcon,
}

const dockItems = [
  { id: 'finder', title: 'Finder', windowId: 'finder' },
  { id: 'launchpad', title: 'Launchpad Hub', windowId: 'launchpad' },
  { id: 'safari', title: 'Certification', windowId: 'safari' },
  { id: 'photos', title: 'Photos', windowId: 'photos' },
  { id: 'terminal', title: 'Terminal', windowId: 'terminal' },
  { id: 'contact', title: 'Contact Me', windowId: 'contact' },
  { id: 'music', title: 'Music' },
  { id: 'vscode', title: 'VS Code' },
  { id: 'setting', title: 'Settings' },
  { id: 'album', title: 'Album' },
  { id: 'garageband', title: 'GarageBand' },
  { id: 'siri', title: 'Siri' },
]

const maxAdditionalSize = 6

function DockVisual({ item }) {
  const iconSrc = ICON_SOURCES[item.id]
  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt={item.title}
        className="dock-app-icon h-full w-full object-contain pointer-events-none drop-shadow-md select-none"
        loading="lazy"
        decoding="async"
      />
    )
  }
  return null
}

export function Dock({ openWindows = {}, onAppClick, onAppHover }) {
  const { registerItem, jumpItem, itemRefs } = useDockMagnify()
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const dockNavRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(max-width: 768px)')
    const updateViewport = () => setIsMobileViewport(query.matches)

    updateViewport()
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])

  /**
   * Continuous mouse hover animation based on frontend.fyi macOS dock implementation.
   * Calculates sub-pixel offset variables (--dock-offset-left / --dock-offset-right)
   * to create the authentic proportional fluid wave expansion.
   */
  const handleAppHover = (ev) => {
    if (!dockNavRef.current) return

    const mousePosition = ev.clientX
    const rect = ev.currentTarget.getBoundingClientRect()
    const iconPositionLeft = rect.left
    const iconWidth = rect.width

    if (iconWidth <= 0) return

    const cursorDistance = (mousePosition - iconPositionLeft) / iconWidth
    const offsetPixels = scaleValue(
      cursorDistance,
      [0, 1],
      [maxAdditionalSize * -1, maxAdditionalSize]
    )

    dockNavRef.current.style.setProperty(
      '--dock-offset-left',
      `${offsetPixels * -1}px`
    )

    dockNavRef.current.style.setProperty(
      '--dock-offset-right',
      `${offsetPixels}px`
    )
  }

  const handleDockMouseLeave = () => {
    if (dockNavRef.current) {
      dockNavRef.current.style.setProperty('--dock-offset-left', '0px')
      dockNavRef.current.style.setProperty('--dock-offset-right', '0px')
    }
  }

  const handleDockClick = (item) => {
    jumpItem(item.id)
    if (!item.windowId && !item.href) return
    onAppClick(item, itemRefs.current[item.id]?.getBoundingClientRect())
  }

  // Find unpinned windows that are minimized into the dock
  const pinnedWindowIds = new Set(
    dockItems.map((item) => item.windowId || item.id)
  )
  const unpinnedMinimized = Object.values(openWindows).filter(
    (w) => w.isOpen && w.isMinimized && !pinnedWindowIds.has(w.id),
  )

  const baseDockWidth = Math.min(1150, Math.max(620, dockItems.length * 78 + 48))
  const dynamicWidth = unpinnedMinimized.length > 0
    ? `min(96vw, ${baseDockWidth + unpinnedMinimized.length * 68}px)`
    : `min(94vw, ${baseDockWidth}px)`

  return (
    <div className="app-dock pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4 overflow-visible">
      <GlassSurface
        width={dynamicWidth}
        height={86}
        borderRadius={30}
        className="pointer-events-auto overflow-visible transition-[width] duration-300"
        displace={isMobileViewport ? 0 : 0.3}
        blur={isMobileViewport ? 7 : 11}
        distortionScale={isMobileViewport ? -40 : -180}
        redOffset={0}
        greenOffset={isMobileViewport ? 4 : 10}
        blueOffset={isMobileViewport ? 8 : 20}
        brightness={50}
        opacity={0.93}
        mixBlendMode="screen"
      >
        <nav
          ref={dockNavRef}
          onMouseLeave={handleDockMouseLeave}
          className="app-dock-nav flex items-end gap-1.5 sm:gap-2 md:gap-2.5 px-3 sm:px-4 h-full pb-2 max-w-full overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Bottom Navigation Bar"
        >
          {dockItems.map((item) => {
            const winState = item.windowId ? openWindows[item.windowId] : null
            const isOpen = Boolean(winState?.isOpen)
            const isMinimized = Boolean(winState?.isMinimized)

            return (
              <button
                key={item.id}
                type="button"
                aria-label={`${item.title} app`}
                ref={(node) => registerItem(item.id, node)}
                onClick={() => handleDockClick(item)}
                onMouseMove={handleAppHover}
                onPointerEnter={() => onAppHover?.(item.windowId || item.id)}
                onFocus={() => onAppHover?.(item.windowId || item.id)}
                data-dock-id={item.windowId || item.id}
                className="dock-app-button group relative flex h-13 w-13 sm:h-14 sm:w-14 md:h-16 md:w-16 origin-bottom items-center justify-center p-1 sm:p-1.5 focus:outline-none shrink-0 overflow-visible hover:z-30 focus:z-30"
              >
                {/* macOS dock tooltip */}
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900/85 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50 select-none whitespace-nowrap">
                  {item.title}
                </span>

                <div
                  className={`h-full w-full flex items-center justify-center transition-opacity duration-200 overflow-visible ${
                    isMinimized ? 'opacity-85' : 'opacity-100'
                  }`}
                >
                  <DockVisual item={item} />
                </div>

                {/* Open/Minimized indicator dot */}
                {isOpen && (
                  <span
                    className={`absolute -bottom-1.5 h-1.5 w-1.5 rounded-full transition-colors ${
                      isMinimized ? 'bg-amber-500/90 ring-1 ring-amber-400/50' : 'bg-slate-900/80'
                    }`}
                  />
                )}
              </button>
            )
          })}

          {unpinnedMinimized.length > 0 && (
            <>
              {/* macOS style vertical glass divider separating persistent apps from minimized windows */}
              <div
                className="dock-minimized-tray my-auto mx-1 h-9 w-[1.5px] rounded-full bg-slate-400/35"
                aria-hidden="true"
              />

              {unpinnedMinimized.map((minWindow) => (
                <button
                  key={minWindow.id}
                  type="button"
                  aria-label={`${minWindow.title} (Minimized)`}
                  ref={(node) => registerItem(minWindow.id, node)}
                  onClick={() =>
                    handleDockClick({
                      id: minWindow.id,
                      title: minWindow.title,
                      windowId: minWindow.id,
                    })
                  }
                  onMouseMove={handleAppHover}
                  onPointerEnter={() => onAppHover?.(minWindow.id)}
                  onFocus={() => onAppHover?.(minWindow.id)}
                  data-dock-id={minWindow.id}
                  className="dock-app-button group relative flex h-14 w-14 sm:h-16 sm:w-16 origin-bottom items-center justify-center p-1.5 animate-in fade-in zoom-in-95 duration-200 focus:outline-none"
                >
                  {/* macOS dock tooltip */}
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900/85 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50 select-none whitespace-nowrap">
                    {minWindow.title}
                  </span>

                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-md backdrop-blur-md">
                    <FolderIcon className="h-8 w-8 text-sky-500 drop-shadow" />
                    <span className="absolute inset-x-0 -bottom-0.5 truncate bg-slate-900/70 px-0.5 text-center text-[7.5px] font-semibold text-white">
                      {minWindow.title}
                    </span>
                  </div>
                  <span className="absolute -bottom-1.5 h-1.5 w-1.5 rounded-full bg-amber-500/90 ring-1 ring-amber-400/50" />
                </button>
              ))}
            </>
          )}
        </nav>
      </GlassSurface>
    </div>
  )
}
