import { Battery, Signal, SlidersHorizontal, Wifi } from 'lucide-react'
import { useClock } from '../hooks/useClock'
import GlassSurface from './GlassSurface'

export function MenuBar({ activeWindowTitle }) {
  const timeLabel = useClock()

  return (
    <header className="fixed inset-x-0 top-0 z-[80] px-2 py-2 sm:px-4">
      <div className="pointer-events-none mx-auto flex h-10 w-full max-w-[1400px]">
        <GlassSurface
          width="100%"
          height={40}
          borderRadius={10}
          className="pointer-events-auto w-full"
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={50}
          opacity={0.88}
          mixBlendMode="screen"
        >
          <div className="mx-auto flex h-10 w-full max-w-[1400px] items-center justify-between px-2 sm:px-4">
            <div className="flex min-w-0 items-center gap-2 text-xs text-white sm:gap-3 sm:text-sm">
              <span className="text-base font-semibold"></span>
              <span className="truncate font-semibold">{activeWindowTitle ?? "Harshit OS"}</span>
              <span className="hidden text-white sm:inline">File</span>
              <span className="hidden text-white sm:inline">Edit</span>
              <span className="hidden text-white sm:inline">View</span>
              <span className="hidden text-white sm:inline">Help</span>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-white sm:gap-2">
              <Wifi size={14} />
              <Signal size={14} className="hidden sm:block" />
              <Battery size={14} className="hidden sm:block" />
              <SlidersHorizontal size={14} className="hidden md:block" />
              <span className="ml-1 text-[11px] font-semibold tracking-wide sm:ml-2 sm:text-xs text-white">{timeLabel}</span>
            </div>
          </div>
        </GlassSurface>
      </div>
    </header>
  )
}
