import { create } from 'zustand'

const BASE_Z_INDEX = 40

function getViewportSize() {
  if (typeof window === 'undefined') return { width: 1280, height: 800 }
  return { width: window.innerWidth, height: window.innerHeight }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function nextActiveWindow(windows) {
  const candidates = Object.values(windows).filter((item) => item.isOpen && !item.isMinimized)
  if (candidates.length === 0) return null
  return candidates.sort((a, b) => b.zIndex - a.zIndex)[0].id
}

export const useWindowStore = create((set, get) => ({
  windows: {},
  activeWindowId: null,
  zCounter: BASE_Z_INDEX,

  openWindow: ({ id, title, sourceRect }) => {
    const state = get()
    const existing = state.windows[id]
    const nextZ = state.zCounter + 1

    set(() => {
      const viewport = getViewportSize()
      const isTerminal = id === 'terminal'
      const preferredSize = isTerminal
        ? { width: 680, height: 460 }
        : { width: 560, height: 560 }
      const maxWidth = Math.max(280, viewport.width - 16)
      const maxHeight = Math.max(240, viewport.height - 70)
      const defaultSize = {
        width: clamp(preferredSize.width, 280, maxWidth),
        height: clamp(preferredSize.height, 240, maxHeight),
      }
      const cascadePosition = {
        x: 140 + Object.keys(state.windows).length * 24,
        y: 82 + Object.keys(state.windows).length * 16,
      }
      const defaultPosition = {
        x: clamp(cascadePosition.x, 8, Math.max(8, viewport.width - defaultSize.width - 8)),
        y: clamp(cascadePosition.y, 54, Math.max(54, viewport.height - defaultSize.height - 8)),
      }

      const windowData = existing
        ? {
            ...existing,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            title,
            zIndex: nextZ,
            position: existing.position
              ? {
                  x: clamp(existing.position.x, 8, Math.max(8, viewport.width - (existing.size?.width ?? defaultSize.width) - 8)),
                  y: clamp(existing.position.y, 54, Math.max(54, viewport.height - (existing.size?.height ?? defaultSize.height) - 8)),
                }
              : defaultPosition,
            size: existing.size
              ? {
                  width: clamp(existing.size.width, 280, maxWidth),
                  height: clamp(existing.size.height, 240, maxHeight),
                }
              : defaultSize,
            sourceRect: sourceRect ?? existing.sourceRect,
          }
        : {
            id,
            title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZ,
            position: defaultPosition,
            size: defaultSize,
            sourceRect,
          }

      return {
        zCounter: nextZ,
        activeWindowId: id,
        windows: {
          ...state.windows,
          [id]: windowData,
        },
      }
    })
  },

  focusWindow: (id) => {
    const state = get()
    if (!state.windows[id]) return
    const nextZ = state.zCounter + 1
    set(() => ({
      zCounter: nextZ,
      activeWindowId: id,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          zIndex: nextZ,
        },
      },
    }))
  },

  closeWindow: (id) => {
    const state = get()
    if (!state.windows[id]) return

    const windows = { ...state.windows }
    delete windows[id]

    set(() => ({
      windows,
      activeWindowId: nextActiveWindow(windows),
    }))
  },

  minimizeWindow: (id) => {
    const state = get()
    if (!state.windows[id]) return

    const windows = {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        isMinimized: true,
      },
    }

    set(() => ({
      windows,
      activeWindowId: nextActiveWindow(windows),
    }))
  },

  restoreWindow: (id) => {
    const state = get()
    if (!state.windows[id]) return
    const nextZ = state.zCounter + 1

    set(() => ({
      zCounter: nextZ,
      activeWindowId: id,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: false,
          zIndex: nextZ,
        },
      },
    }))
  },

  toggleMaximize: (id) => {
    const state = get()
    if (!state.windows[id]) return
    set(() => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: !state.windows[id].isMaximized,
        },
      },
    }))
  },

  setWindowPosition: (id, position) => {
    const state = get()
    if (!state.windows[id]) return

    const viewport = getViewportSize()
    const target = state.windows[id]
    const size = target.size ?? { width: 560, height: 560 }
    const clampedPosition = {
      x: clamp(position.x, 8, Math.max(8, viewport.width - size.width - 8)),
      y: clamp(position.y, 54, Math.max(54, viewport.height - size.height - 8)),
    }

    set(() => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: clampedPosition,
        },
      },
    }))
  },

  setWindowSize: (id, size) => {
    const state = get()
    if (!state.windows[id]) return

    const viewport = getViewportSize()
    const clampedSize = {
      width: clamp(size.width, 280, Math.max(280, viewport.width - 16)),
      height: clamp(size.height, 240, Math.max(240, viewport.height - 70)),
    }

    set(() => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size: clampedSize,
        },
      },
    }))
  },
}))
