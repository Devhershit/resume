import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useWindowStore } from '../store/windowStore'

import instaLiquidIcon from '../../icons/insta-liquid.png'
import xLiquidIcon from '../../icons/x-liquid.png'
import githubLiquidIcon from '../../icons/github-liquid.png'
import linkedinLiquidIcon from '../../icons/linkedin-liquid.png'
import phoneLiquidIcon from '../../icons/phone-liquid.png'
import mailLiquidIcon from '../../icons/mail-liquid.png'
import mapsLiquidIcon from '../../icons/maps-liquid.png'

import musicIcon from '../../icons/iosmusic.png'
import vsIcon from '../../icons/vs.png'
import settingIcon from '../../icons/setting.png'
import albumIcon from '../../icons/album.png'
import garageBandIcon from '../../icons/GarageBand.png'
import siriIcon from '../../icons/siri.png'

const APP_CATEGORIES = [
  {
    category: 'Applications & Media',
    apps: [
      {
        id: 'music',
        label: 'Music',
        icon: musicIcon,
        href: 'https://music.apple.com',
        color: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50 hover:bg-rose-100',
        ringColor: 'ring-rose-200',
      },
      {
        id: 'vscode',
        label: 'VS Code',
        icon: vsIcon,
        href: 'https://vscode.dev',
        color: 'from-blue-600 to-sky-500',
        bgColor: 'bg-sky-50 hover:bg-sky-100',
        ringColor: 'ring-sky-200',
      },
      {
        id: 'album',
        label: 'Album',
        icon: albumIcon,
        windowId: 'photos',
        color: 'from-amber-400 via-purple-500 to-blue-500',
        bgColor: 'bg-purple-50 hover:bg-purple-100',
        ringColor: 'ring-purple-200',
      },
      {
        id: 'garageband',
        label: 'GarageBand',
        icon: garageBandIcon,
        href: 'https://www.apple.com/mac/garageband/',
        color: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50 hover:bg-amber-100',
        ringColor: 'ring-amber-200',
      },
      {
        id: 'setting',
        label: 'Settings',
        icon: settingIcon,
        windowId: 'about',
        color: 'from-slate-400 to-slate-600',
        bgColor: 'bg-slate-50 hover:bg-slate-100',
        ringColor: 'ring-slate-200',
      },
      {
        id: 'siri',
        label: 'Siri',
        icon: siriIcon,
        href: 'https://www.apple.com/siri/',
        color: 'from-indigo-400 via-purple-400 to-pink-400',
        bgColor: 'bg-indigo-50 hover:bg-indigo-100',
        ringColor: 'ring-indigo-200',
      },
    ],
  },
  {
    category: 'Social & Connections',
    apps: [
      {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: linkedinLiquidIcon,
        href: 'https://linkedin.com/in/harshit-gahlawat',
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-50 hover:bg-blue-100',
        ringColor: 'ring-blue-200',
      },
      {
        id: 'github',
        label: 'GitHub',
        icon: githubLiquidIcon,
        href: 'https://github.com/Devhershit',
        color: 'from-gray-700 to-gray-900',
        bgColor: 'bg-gray-50 hover:bg-gray-100',
        ringColor: 'ring-gray-200',
      },
      {
        id: 'x',
        label: 'X',
        icon: xLiquidIcon,
        href: 'https://x.com/CarbonClicks',
        color: 'from-slate-700 to-slate-900',
        bgColor: 'bg-slate-50 hover:bg-slate-100',
        ringColor: 'ring-slate-200',
      },
      {
        id: 'instagram',
        label: 'Instagram',
        icon: instaLiquidIcon,
        href: 'https://www.instagram.com/',
        color: 'from-pink-500 via-red-500 to-yellow-500',
        bgColor: 'bg-pink-50 hover:bg-pink-100',
        ringColor: 'ring-pink-200',
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: phoneLiquidIcon,
        href: 'https://wa.me/91701109554',
        color: 'from-green-400 to-green-600',
        bgColor: 'bg-green-50 hover:bg-green-100',
        ringColor: 'ring-green-200',
      },
      {
        id: 'mail',
        label: 'Mail',
        icon: mailLiquidIcon,
        href: 'mailto:harshitgahlawat33@gmail.com',
        color: 'from-sky-400 to-blue-600',
        bgColor: 'bg-sky-50 hover:bg-sky-100',
        ringColor: 'ring-sky-200',
      },
      {
        id: 'maps',
        label: 'Maps',
        icon: mapsLiquidIcon,
        href: 'https://maps.google.com/?q=Delhi+NCR,India',
        color: 'from-emerald-400 to-teal-600',
        bgColor: 'bg-emerald-50 hover:bg-emerald-100',
        ringColor: 'ring-emerald-200',
      },
    ],
  },
]

function AppIcon({ app }) {
  const openWindow = useWindowStore((state) => state.openWindow)

  const handleClick = (e) => {
    if (app.windowId) {
      e.preventDefault()
      openWindow({ id: app.windowId, title: app.label })
    }
  }

  const iconBody = (
    <>
      <div
        className={`
          relative h-16 w-16 rounded-[22px] ${app.bgColor} ring-2 ${app.ringColor}
          shadow-md shadow-black/10
          transition-all duration-200
          group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-black/20
          group-active:scale-95
          overflow-hidden flex items-center justify-center p-1
        `}
      >
        {/* Gradient shimmer overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-15 transition-opacity duration-200 rounded-[22px]`}
        />
        <img
          src={app.icon}
          alt={app.label}
          className="h-full w-full object-contain pointer-events-none select-none"
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="text-[11px] font-semibold text-slate-700 tracking-wide drop-shadow-sm text-center leading-tight max-w-[76px] truncate">
        {app.label}
      </span>
    </>
  )

  if (app.href) {
    return (
      <a
        href={app.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${app.label}`}
        className="group flex flex-col items-center gap-2 select-none"
      >
        {iconBody}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Open ${app.label}`}
      className="group flex flex-col items-center gap-2 select-none focus:outline-none cursor-pointer"
    >
      {iconBody}
    </button>
  )
}

export function LaunchpadContent() {
  const [searchQuery, setSearchQuery] = useState('')

  const allApps = useMemo(
    () => APP_CATEGORIES.flatMap((c) => c.apps),
    []
  )

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return APP_CATEGORIES

    return APP_CATEGORIES.map((cat) => ({
      ...cat,
      apps: cat.apps.filter((app) => app.label.toLowerCase().includes(query)),
    })).filter((cat) => cat.apps.length > 0)
  }, [searchQuery])

  const totalFilteredCount = useMemo(
    () => filteredCategories.reduce((acc, cat) => acc + cat.apps.length, 0),
    [filteredCategories]
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header with Search */}
      <div className="border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xs">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25" />
              <circle cx="8.5" cy="8.5" r="2" fill="white" />
              <circle cx="15.5" cy="8.5" r="2" fill="white" />
              <circle cx="8.5" cy="15.5" r="2" fill="white" />
              <circle cx="15.5" cy="15.5" r="2" fill="white" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Launchpad</h2>

          {/* Search bar */}
          <div className="relative ml-auto w-44 sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full rounded-full border border-slate-200/90 bg-slate-100/80 py-1 pl-8 pr-7 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
            {allApps.length} apps
          </span>
        </div>
      </div>

      {/* App Grid */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100/60 p-5 md:p-7">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, idx) => (
            <div key={cat.category} className={idx > 0 ? 'mt-8' : ''}>
              {/* Category label */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200/80" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {cat.category} ({cat.apps.length})
                </span>
                <div className="h-px flex-1 bg-slate-200/80" />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
                {cat.apps.map((app) => (
                  <AppIcon key={app.id} app={app} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-slate-500">No apps matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="mt-1 text-xs text-slate-400">Try searching for Music, VS Code, Settings, or GitHub</p>
          </div>
        )}

        {/* Tip */}
        <p className="mt-8 text-center text-[11px] text-slate-400 select-none">
          Click any app to launch or open in browser ↗
        </p>
      </div>

      {/* Footer */}
      <nav className="flex items-center justify-between border-t border-slate-200/80 bg-white/90 px-4 py-2.5 text-xs text-slate-500 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
          <span className="font-semibold text-slate-700">Launchpad Hub</span>
          <span className="text-slate-300">•</span>
          <span>{totalFilteredCount} {totalFilteredCount === 1 ? 'app' : 'apps'} available</span>
        </div>
        <span className="hidden sm:block text-[11px] text-slate-400">Apps &amp; Connections</span>
      </nav>
    </div>
  )
}
