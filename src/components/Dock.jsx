import { useDockMagnify } from '../hooks/useDockMagnify'
import GlassSurface from './GlassSurface'

import finderIcon from '../../icons/finder.png'
import safariIcon from '../../icons/safari-ios.png'
import photosIcon from '../../icons/ios-photos.png'
import terminalIcon from '../../icons/terminal.png'
import contactIcon from '../../icons/contact-ios.png'

const ICON_SOURCES = {
  launchpad: finderIcon,
  safari: safariIcon,
  photos: photosIcon,
  terminal: terminalIcon,
  contact: contactIcon,
}

const dockItems = [
  { id: 'launchpad', title: 'Launchpad' },
  { id: 'safari', title: 'Safari', windowId: 'safari' },
  { id: 'photos', title: 'Photos', windowId: 'photos' },
  { id: 'terminal', title: 'Terminal', windowId: 'terminal' },
  { id: 'contact', title: 'Contact', windowId: 'contact' },
]

function DockVisual({ item }) {
  const iconSrc = ICON_SOURCES[item.id]
  if (iconSrc) return <img src={iconSrc} alt={item.title} className="h-12 w-12" />
  return null
}

export function Dock({ openWindows, onAppClick }) {
  const { registerItem, onPointerMove, onPointerLeave, itemRefs } = useDockMagnify()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4">
      <GlassSurface
        width="min(92vw, 560px)"
        height={86}
        borderRadius={30}
        className="pointer-events-auto"
        displace={0.5}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        brightness={50}
        opacity={0.93}
        mixBlendMode="screen"
      >
        <nav onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="flex items-end gap-3 px-2">
          {dockItems.map((item) => {
            const hasIndicator = item.windowId ? Boolean(openWindows[item.windowId]) : false

            return (
              <button
                key={item.id}
                type="button"
                title={item.title}
                ref={(node) => registerItem(item.id, node)}
                onClick={() => onAppClick(item, itemRefs.current[item.id]?.getBoundingClientRect())}
                className="group relative flex h-16 w-16 origin-bottom items-center justify-center"
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
