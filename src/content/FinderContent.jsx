import { useMemo, useState } from 'react'
import { Search, X, AppWindow, HardDrive, Sparkles } from 'lucide-react'
import { useWindowStore } from '../store/windowStore'

const HUB_ITEMS = [
  { id: 'about', title: 'About Me', group: 'My Computer', summary: 'Profile, background, and tech journey' },
  { id: 'projects', title: 'Projects', group: 'My Computer', summary: 'Portfolio builds and live web apps' },
  { id: 'work-exp', title: 'Work Experience', group: 'My Computer', summary: 'Roles, timeline, and company impact' },
  { id: 'resume', title: 'Resume', group: 'My Computer', summary: 'CV, qualifications, and downloadable PDF' },
  { id: 'socials', title: 'Socials', group: 'Applications', summary: 'GitHub, LinkedIn, Twitter, and profiles' },
  { id: 'contact', title: 'Contact Me', group: 'Applications', summary: 'Direct email and contact cards' },
  { id: 'safari', title: 'Certification', group: 'Applications', summary: 'Verified certificates and credentials' },
  { id: 'photos', title: 'Photos', group: 'Applications', summary: 'Visual photo gallery and media' },
  { id: 'terminal', title: 'Terminal', group: 'Applications', summary: 'Interactive macOS CLI console' },
]

function HubSection({ title, icon: Icon, items, onOpen }) {
  if (items.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 backdrop-blur-sm md:p-4 shadow-xs">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-400" />}
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {items.length}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={onOpen(item)}
            className="group rounded-xl border border-slate-200/90 bg-white/80 p-3 text-left shadow-2xs transition-all duration-150 hover:border-sky-300 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                {item.title}
              </span>
              <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open ↗
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 line-clamp-1">{item.summary}</div>
          </button>
        ))}
      </div>
    </section>
  )
}

export function FinderContent() {
  const openWindow = useWindowStore((state) => state.openWindow)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return HUB_ITEMS

    return HUB_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(query)
      const matchSummary = item.summary.toLowerCase().includes(query)
      const matchGroup = item.group.toLowerCase().includes(query)
      return matchTitle || matchSummary || matchGroup
    })
  }, [searchQuery])

  const grouped = useMemo(() => {
    return {
      myComputer: filteredItems.filter((item) => item.group === 'My Computer'),
      applications: filteredItems.filter((item) => item.group === 'Applications'),
    }
  }, [filteredItems])

  const handleOpen = (item) => (event) => {
    const sourceRect = event.currentTarget.getBoundingClientRect()
    openWindow({ id: item.id, title: item.title, sourceRect })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50/50">
      {/* Top Search Bar */}
      <div className="border-b border-slate-200/80 bg-white/80 p-3 backdrop-blur-md md:px-5 md:py-3.5">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2 shadow-2xs transition-all focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Finder (e.g. Projects, Resume, Terminal)..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5">
        {filteredItems.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            <HubSection
              title="My Computer"
              icon={HardDrive}
              items={grouped.myComputer}
              onOpen={handleOpen}
            />
            <HubSection
              title="Applications"
              icon={AppWindow}
              items={grouped.applications}
              onOpen={handleOpen}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={22} />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-700">No matching items found</h4>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              No applications or folders match &ldquo;{searchQuery}&rdquo;. Try another search term.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-sky-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navbar for Finder */}
      <nav className="flex items-center justify-between border-t border-slate-200/80 bg-white/90 px-4 py-2.5 text-xs text-slate-500 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span className="font-semibold text-slate-700">Finder</span>
          <span className="text-slate-300">•</span>
          <span>{filteredItems.length} of {HUB_ITEMS.length} available</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
          <Sparkles size={12} className="text-amber-500" />
          <span>Click any card to launch</span>
        </div>
      </nav>
    </div>
  )
}
