import { create } from 'zustand'
import harshitIslandImage from '../../icons/Harshit OS isl.png'
import defaultFlowImage from '../../icons/mainport.webp'

export const WALLPAPERS = [
  {
    id: 'harshit-island',
    name: 'Harshit OS Island',
    tagline: 'Retro Chromatic Island',
    url: harshitIslandImage,
    thumbnail: harshitIslandImage,
  },
  {
    id: 'default-flow',
    name: 'macOS Monterey Flow',
    tagline: 'Classic Monterey Blue Flow',
    url: defaultFlowImage,
    thumbnail: defaultFlowImage,
  },
]

const getInitialWallpaperId = () => {
  if (typeof window === 'undefined') return 'default-flow'
  try {
    return localStorage.getItem('harshit_os_wallpaper') || 'default-flow'
  } catch {
    return 'default-flow'
  }
}

export const useWallpaperStore = create((set, get) => ({
  wallpapers: WALLPAPERS,
  currentId: getInitialWallpaperId(),
  setWallpaper: (id) => {
    const exists = WALLPAPERS.some((w) => w.id === id)
    if (!exists) return
    try {
      localStorage.setItem('harshit_os_wallpaper', id)
    } catch {
      // ignore localStorage error in private browsing
    }
    set({ currentId: id })
  },
  getCurrentWallpaper: () => {
    const state = get()
    return WALLPAPERS.find((w) => w.id === state.currentId) || WALLPAPERS[0]
  },
}))
