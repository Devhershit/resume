import { useState, useRef, useEffect } from 'react'
import { Battery, Signal, SlidersHorizontal, Wifi, Copy, Check, ExternalLink } from 'lucide-react'
import { useClock } from '../hooks/useClock'

const EVIL_QUOTES = [
  "Look at you, inspecting my portfolio like you're actually gonna hire me. Pay the toll.",
  "Every second you browse for free, I push untested breaking code directly to production main.",
  "You wouldn't steal a car, but you're happily stealing my bandwidth. Drop ₹50 or I delete the CSS.",
  "Your recruiter ghosted me last Tuesday. Donating to my UPI is your legal restitution.",
  "I didn't suffer through 4 years of engineering to ask nicely. Hand over the funds.",
  "Skip donating? Enjoy your next npm install introducing 47 fatal peer-dependency conflicts.",
  "I trained an AI to automate your exact job while you stared at my dock. Pay up to cancel it.",
  "Your company's entire backend is held together by one unpaid teenager. Send tribute.",
  "This isn't a charity. It's an extortion racket to prevent me from becoming your next manager.",
  "Every unpaid visit guarantees another mandatory 8:00 AM Monday standup in your immediate future.",
]

export function MenuBar() {
  const timeLabel = useClock()
  const [helpOpen, setHelpOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const helpRef = useRef(null)

  const upiId = 'Harshit1166@slc'

  // Constant 5-second rotation through the 10 evil quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % EVIL_QUOTES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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

          {/* Help Section - Clean, no hover effect */}
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
                className="absolute left-0 top-full mt-2 w-[310px] sm:w-[360px] rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 text-slate-800 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-2xl z-[90] animate-in fade-in zoom-in-95 duration-150"
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
                    <span className="ml-2 text-xs font-semibold text-slate-800">Support / Extortion Desk</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200/70 px-1.5 py-0.5 rounded-full">
                    <span>#{quoteIndex + 1}/10</span>
                  </div>
                </div>

                {/* Rotating Evil Quote (Swaps every 5s) */}
                <div className="mt-3.5 rounded-xl border border-rose-200/80 bg-rose-50/60 p-3 min-h-[72px] flex items-center shadow-inner">
                  <p
                    key={quoteIndex}
                    className="text-xs font-semibold leading-relaxed text-slate-900 animate-in fade-in slide-in-from-bottom-1 duration-300"
                  >
                    &ldquo;{EVIL_QUOTES[quoteIndex]}&rdquo; 💀
                  </p>
                </div>

                {/* Progress Indicators for 10 Quotes */}
                <div className="mt-2.5 flex items-center justify-center gap-1">
                  {EVIL_QUOTES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuoteIndex(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === quoteIndex ? 'w-4 bg-rose-600' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Jump to quote ${i + 1}`}
                    />
                  ))}
                </div>

                {/* UPI Card (Matching Website Folders & Cards) */}
                <div className="mt-3.5 rounded-xl border border-slate-200 bg-slate-50/90 p-3 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-slate-700">UPI ID (GPay / PhonePe / Paytm)</span>
                    <span className="font-mono text-[10px] text-rose-600 font-bold">Pay The Ransom</span>
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
                    href={`upi://pay?pa=${upiId}&pn=Harshit&cu=INR&tn=Extortion%20Ransom`}
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

                {/* Tiny timer note */}
                <p className="mt-2.5 text-center text-[9.5px] text-slate-400 select-none">
                  New threat every 5 seconds • No mercy • 100% real
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
