import { useState, useRef, useEffect } from 'react'
import { Battery, Signal, SlidersHorizontal, Wifi, Coffee, Copy, Check, Sparkles, Heart, ExternalLink } from 'lucide-react'
import { useClock } from '../hooks/useClock'

export function MenuBar() {
  const timeLabel = useClock()
  const [helpOpen, setHelpOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const helpRef = useRef(null)

  const upiId = 'Harshit1166@slc'

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setHelpOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setHelpOpen(false)
    }

    if (helpOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [helpOpen])

  return (
    <header className="app-menu-bar fixed inset-x-0 top-0 z-[80]">
      <div className="flex h-10 w-full items-center justify-between px-3">
        {/* Top Bar Series: Harshit OS, followed by File, Edit, View, Go, Window, Help */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white select-none">
          <span className="font-bold text-white tracking-tight px-1.5 py-0.5 rounded hover:bg-white/10 transition">
            Harshit OS
          </span>
          <span className="text-white/80 px-1.5 py-0.5 rounded hover:bg-white/10 transition cursor-default">File</span>
          <span className="text-white/80 px-1.5 py-0.5 rounded hover:bg-white/10 transition cursor-default">Edit</span>
          <span className="text-white/80 px-1.5 py-0.5 rounded hover:bg-white/10 transition cursor-default">View</span>
          <span className="text-white/80 px-1.5 py-0.5 rounded hover:bg-white/10 transition cursor-default">Go</span>
          <span className="text-white/80 px-1.5 py-0.5 rounded hover:bg-white/10 transition cursor-default">Window</span>

          {/* Interactive Help Section */}
          <div className="relative" ref={helpRef}>
            <button
              type="button"
              onClick={() => setHelpOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                helpOpen
                  ? 'bg-white/25 text-white font-medium shadow-sm'
                  : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <span>Help</span>
              <Sparkles size={11} className="text-amber-300 animate-pulse" />
            </button>

            {/* Help Dropdown Popover */}
            {helpOpen && (
              <div
                className="absolute left-0 sm:left-auto top-full mt-2 w-[310px] sm:w-[350px] rounded-2xl border border-white/20 bg-slate-900/90 p-4 text-white shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-[90]"
                style={{
                  boxShadow: '0 24px 48px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30">
                      <Coffee size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold tracking-wide text-white">Support &amp; Chai Fund</h4>
                      <p className="text-[10px] text-white/50">Harshit OS Emergency Help Desk</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                    <Heart size={9} className="fill-emerald-400 text-emerald-400" /> Active
                  </span>
                </div>

                {/* Quirky Message */}
                <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
                  <p>
                    Need help? <strong className="text-white font-medium">So does my sleep schedule!</strong> ☕
                  </p>
                  <p className="text-[11px] text-slate-300/90">
                    Recreating macOS in pure React with liquid Genie effects and sub-pixel physics took{' '}
                    <span className="text-amber-300 font-medium">400+ cups of chai</span>, hours of non-linear geometry,
                    and infinite debugging.
                  </p>
                  <p className="text-[11px] text-slate-300/90">
                    If Harshit OS brought a smile to your face or inspired your projects, drop some chai money to fuel the next big build!
                  </p>
                </div>

                {/* UPI Box */}
                <div className="mt-3.5 rounded-xl border border-white/15 bg-black/40 p-2.5">
                  <div className="flex items-center justify-between text-[10px] text-white/60 mb-1">
                    <span>UPI ID (Google Pay, PhonePe, Paytm)</span>
                    <span className="text-amber-300/80 font-mono">0% Fee • Instant Chai</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 ring-1 ring-white/10">
                    <span className="font-mono text-xs font-semibold text-white tracking-wide selection:bg-amber-400 selection:text-black">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-1 text-[11px] font-semibold text-slate-950 transition hover:bg-amber-300 active:scale-95 shadow-sm"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-950" />
                          <span>Copied! 🎉</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct Pay Link for mobile devices */}
                <div className="mt-3 flex items-center justify-between gap-2 pt-1">
                  <a
                    href={`upi://pay?pa=${upiId}&pn=Harshit&cu=INR&tn=Support%20Harshit%20OS`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/10 py-1.5 text-center text-[11px] font-medium text-white transition hover:bg-white/20 active:scale-98"
                  >
                    <span>Open in UPI App</span>
                    <ExternalLink size={11} className="opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setHelpOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-[11px] text-white/60 hover:text-white transition"
                  >
                    Close
                  </button>
                </div>

                {/* Quirky Footnote */}
                <p className="mt-2.5 text-center text-[9.5px] text-white/40 italic">
                  &ldquo;100% of proceeds go towards caffeinated coding sessions &amp; zero-bug commits!&rdquo; 🚀
                </p>
              </div>
            )}
          </div>
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
