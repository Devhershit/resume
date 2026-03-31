import { useEffect, useState } from 'react'
import { useDockMagnify } from '../hooks/useDockMagnify'
import GlassSurface from './GlassSurface'

import finderIcon from '../../icons/finder.webp'
import safariIcon from '../../icons/safari-ios.webp'
import photosIcon from '../../icons/ios-photos.png'
import terminalIcon from '../../icons/terminal.png'
import contactIcon from '../../icons/contact-ios.webp'

const ICON_SOURCES = {
  launchpad: finderIcon,
  safari: safariIcon,
  photos: photosIcon,
  terminal: terminalIcon,
  contact: contactIcon,
}

const dockItems = [
  { id: 'launchpad', title: 'Launchpad', windowId: 'launchpad' },
  { id: 'safari', title: 'Certification', windowId: 'safari' },
  { id: 'photos', title: 'Photos', windowId: 'photos' },
  { id: 'terminal', title: 'Terminal', windowId: 'terminal' },
  { id: 'contact', title: 'Contact Me', windowId: 'contact' },
]

function DockVisual({ item }) {
  const iconSrc = ICON_SOURCES[item.id]
  if (iconSrc) return <img src={iconSrc} alt={item.title} className="dock-app-icon h-12 w-12" loading="lazy" decoding="async" />
  return null
}

export function Dock({ openWindows, onAppClick, onAppHover }) {
  const { registerItem, onPointerMove, onPointerLeave, jumpItem, itemRefs } = useDockMagnify()
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(max-width: 768px)')
    const updateViewport = () => setIsMobileViewport(query.matches)

    updateViewport()
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])

  const handleDockClick = (item) => {
    jumpItem(item.id)
    onAppClick(item, itemRefs.current[item.id]?.getBoundingClientRect())
  }

  return (
    <div className="app-dock pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4">
      <GlassSurface
        width="min(92vw, 560px)"
        height={86}
        borderRadius={30}
        className="pointer-events-auto"
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
        <nav onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="app-dock-nav flex items-end gap-3 px-2">
          {dockItems.map((item) => {
            const hasIndicator = item.windowId ? Boolean(openWindows[item.windowId]) : false

            return (
              <button
                key={item.id}
                type="button"
                title={item.title}
                aria-label={`${item.title} app`}
                ref={(node) => registerItem(item.id, node)}
                onClick={() => handleDockClick(item)}
                onPointerEnter={() => onAppHover?.(item.id)}
                onFocus={() => onAppHover?.(item.id)}
                className="dock-app-button group relative flex h-16 w-16 origin-bottom items-center justify-center"
              >
                <DockVisual item={item} />
                {hasIndicator && <span className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-slate-900/80" />}
              </button>
            )
          })}
        </nav>
      </GlassSurface>
    </div>
  )
}
