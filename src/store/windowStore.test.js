import { beforeEach, describe, expect, it } from 'vitest'
import { useWindowStore } from './windowStore'

describe('windowStore', () => {
  beforeEach(() => {
    useWindowStore.setState({ windows: {}, activeWindowId: null, zCounter: 40 })
  })

  it('opens a new window and sets it active', () => {
    const { openWindow } = useWindowStore.getState()
    openWindow({ id: 'about', title: 'About Me' })

    const state = useWindowStore.getState()
    expect(state.activeWindowId).toBe('about')
    expect(state.windows.about).toBeDefined()
    expect(state.windows.about.isOpen).toBe(true)
    expect(state.windows.about.isMinimized).toBe(false)
  })

  it('minimizes a window and can restore it', () => {
    const { openWindow, minimizeWindow, restoreWindow } = useWindowStore.getState()
    openWindow({ id: 'projects', title: 'Projects' })
    minimizeWindow('projects')

    let state = useWindowStore.getState()
    expect(state.windows.projects.isMinimized).toBe(true)

    restoreWindow('projects')
    state = useWindowStore.getState()
    expect(state.windows.projects.isMinimized).toBe(false)
    expect(state.activeWindowId).toBe('projects')
  })

  it('clamps position when moving windows outside bounds', () => {
    const { openWindow, setWindowPosition } = useWindowStore.getState()
    openWindow({ id: 'resume', title: 'Resume' })
    setWindowPosition('resume', { x: -9999, y: -9999 })

    const state = useWindowStore.getState()
    expect(state.windows.resume.position.x).toBeGreaterThanOrEqual(8)
    expect(state.windows.resume.position.y).toBeGreaterThanOrEqual(54)
  })

  it('closes window and clears active id when no windows remain', () => {
    const { openWindow, closeWindow } = useWindowStore.getState()
    openWindow({ id: 'terminal', title: 'Terminal' })
    closeWindow('terminal')

    const state = useWindowStore.getState()
    expect(state.windows.terminal).toBeUndefined()
    expect(state.activeWindowId).toBe(null)
  })
})
