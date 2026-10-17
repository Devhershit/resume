import { Battery, Signal, SlidersHorizontal, Wifi } from 'lucide-react'
import { useClock } from '../hooks/useClock'

export function MenuBar() {
  const timeLabel = useClock()

  return (
    <header className="app-menu-bar fixed inset-x-0 top-0 z-[80]">
      <div className="flex h-10 w-full items-center justify-between px-3">
        {/* Top Bar Series: Harshit OS, followed by File, Edit, View, Go, Window, Help */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-white select-none">
          <span className="font-bold text-white tracking-tight">Harshit OS</span>
          <span className="text-white/90">File</span>
          <span className="text-white/90">Edit</span>
          <span className="text-white/90">View</span>
          <span className="text-white/90">Go</span>
          <span className="text-white/90">Window</span>
          <span className="text-white/90">Help</span>
        </div>

        {/* Right Side Status Icons & Clock */}
        <div className="flex shrink-0 items-center gap-1.5 text-white sm:gap-2">
          <Wifi size={14} className="opacity-90" />
          <Signal size={14} className="hidden sm:block opacity-90" />
          <Battery size={14} className="hidden sm:block opacity-90" />
          <SlidersHorizontal size={14} className="hidden md:block opacity-90" />
          <span className="ml-1 text-[11px] font-semibold tracking-wide sm:ml-2 sm:text-xs text-white">
            {timeLabel}
          </span>
        </div>
      </div>
    </header>
  )
}
