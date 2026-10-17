import { useState, useRef, useEffect } from 'react'
import { Battery, Signal, SlidersHorizontal, Wifi, Copy, Check, ExternalLink } from 'lucide-react'
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
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-white select-none">
          <span className="font-bold text-white tracking-tight">Harshit OS</span>
          <span className="text-white/90">File</span>
          <span className="text-white/90">Edit</span>
          <span className="text-white/90">View</span>
          <span className="text-white/90">Go</span>
          <span className="text-white/90">Window</span>

          {/* Help Section - Clean, no flashy hover effects */}
          <div className="relative" ref={helpRef}>
            <button
              type="button"
              onClick={() => setHelpOpen((prev) => !prev)}
              className="text-white/90 cursor-pointer focus:outline-none"
            >
              Help
            </button>

            {/* Help Window Dropdown - Matches website folder / window theme */}
            {helpOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-[320px] sm:w-[380px] rounded-2xl border border-slate-200/90 bg-white/95 p-5 text-slate-800 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-2xl z-[90] animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Window Traffic Lights Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHelpOpen(false)}
                      className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/10 transition-transform active:scale-90"
                      aria-label="Close"
                    />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/10" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/10" />
                    <span className="ml-2 text-xs font-semibold text-slate-800">Support / Mental Health Fund</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">v4.04-sanity</span>
                </div>

                {/* Dark Comedy Body */}
                <div className="mt-3.5 space-y-2.5 text-xs leading-relaxed text-slate-600">
                  <p className="font-medium text-slate-900">
                    You clicked &ldquo;Help&rdquo; expecting documentation. Instead, you found a developer in crisis. 💀
                  </p>
                  <p>
                    Rebuilding macOS inside a web browser with liquid Genie math and 85 canvas slices wasn&apos;t a technical ambition—it was a cry for help.
                  </p>
                  <p>
                    Therapy is ₹2,500/hour. Donating to this UPI is far cheaper and directly delays my transition into a soulless corporate drone who only speaks in Jira tickets.
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    0% goes to chai. 100% goes toward surviving late-stage JavaScript fatigue and buying enough compute to outrun the AI that will inevitably replace us all.
                  </p>
                </div>

                {/* UPI Card (Matching Website Folders & Cards) */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/90 p-3 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-slate-700">UPI ID (GPay / PhonePe / Paytm)</span>
                    <span className="font-mono text-[10px] text-rose-600 font-medium">Non-Tax-Deductible</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <span className="font-mono text-xs font-bold text-slate-900 tracking-wide select-all">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-slate-800 active:scale-95 shadow-sm"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span>Copied! 💸</span>
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

                {/* Direct Pay Link & Close Action */}
                <div className="mt-3.5 flex items-center justify-between gap-2">
                  <a
                    href={`upi://pay?pa=${upiId}&pn=Harshit&cu=INR&tn=Mental%20Health%20Fund`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-center text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-98"
                  >
                    <span>Open UPI App</span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setHelpOpen(false)}
                    className="rounded-lg border border-transparent px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Dark Comedy Footnote */}
                <p className="mt-3 text-center text-[10px] text-slate-400 select-none">
                  &ldquo;Donate today, or an <code className="text-rose-500">undefined is not a function</code> error claims what&apos;s left of my sanity.&rdquo;
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
