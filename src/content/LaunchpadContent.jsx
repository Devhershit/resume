import { useMemo } from 'react'
import { useWindowStore } from '../store/windowStore'

const HUB_ITEMS = [
  { id: 'about', title: 'About Me', group: 'My Computer', summary: 'Profile and intro' },
  { id: 'projects', title: 'Projects', group: 'My Computer', summary: 'Portfolio builds' },
  { id: 'work-exp', title: 'Work Experience', group: 'My Computer', summary: 'Roles and impact' },
  { id: 'resume', title: 'Resume', group: 'My Computer', summary: 'CV and highlights' },
  { id: 'socials', title: 'Socials', group: 'Applications', summary: 'All social links' },
  { id: 'contact', title: 'Contact Me', group: 'Applications', summary: 'Call and email cards' },
  { id: 'safari', title: 'Certification', group: 'Applications', summary: 'Credentials and docs' },
  { id: 'photos', title: 'Photos', group: 'Applications', summary: 'Gallery and media' },
  { id: 'terminal', title: 'Terminal', group: 'Applications', summary: 'Console style panel' },
]

function HubSection({ title, items, onOpen }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 backdrop-blur-sm md:p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={onOpen(item)}
            className="rounded-xl border border-slate-200/90 bg-white/80 px-3 py-3 text-left"
          >
            <div className="text-sm font-semibold text-slate-800">{item.title}</div>
            <div className="mt-1 text-xs text-slate-500">{item.summary}</div>
          </button>
        ))}
      </div>
    </section>
  )
}

export function LaunchpadContent() {
  const openWindow = useWindowStore((state) => state.openWindow)

  const grouped = useMemo(() => {
    return {
      myComputer: HUB_ITEMS.filter((item) => item.group === 'My Computer'),
      applications: HUB_ITEMS.filter((item) => item.group === 'Applications'),
    }
  }, [])

  const handleOpen = (item) => (event) => {
    const sourceRect = event.currentTarget.getBoundingClientRect()
    openWindow({ id: item.id, title: item.title, sourceRect })
  }

  return (
    <div className="h-full overflow-y-auto p-3 md:p-5">
      <div className="space-y-3 md:space-y-4">
        <HubSection title="My Computer" items={grouped.myComputer} onOpen={handleOpen} />
        <HubSection title="Applications" items={grouped.applications} onOpen={handleOpen} />
      </div>
    </div>
  )
}
