import { create } from 'zustand'

export const useGenieStore = create((set) => ({
  animations: [],

  startGenieAnimation: ({
    windowId,
    type = 'minimize', // 'minimize' | 'restore'
    windowRect,
    targetRect,
    snapshot,
    duration = 0.65,
    onComplete,
  }) => {
    const id = `${windowId}-${type}-${Date.now()}`
    const newAnimation = {
      id,
      windowId,
      type,
      windowRect,
      targetRect,
      snapshot,
      duration,
      onComplete,
    }

    set((state) => ({
      animations: [...state.animations, newAnimation],
    }))

    return id
  },

  removeGenieAnimation: (id) => {
    set((state) => ({
      animations: state.animations.filter((a) => a.id !== id),
    }))
  },
}))
