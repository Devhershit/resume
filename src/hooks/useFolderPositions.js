import { useEffect, useState } from 'react'

const STORAGE_KEY = 'desktop_folder_positions_v2'
const GRID_SIZE = 20 // Invisible grid gap in pixels

function snapToGrid(value) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

const DEFAULT_POSITIONS = {
  about: { x: 20, y: 20 },
  projects: { x: 140, y: 20 },
  'work-exp': { x: 260, y: 20 },
  resume: { x: 380, y: 20 },
  contact: { x: 500, y: 20 },
}

function getInitialPositions() {
  try {
    if (typeof window === 'undefined') return DEFAULT_POSITIONS
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_POSITIONS
  } catch (e) {
    console.error('Failed to parse folder positions:', e)
    return DEFAULT_POSITIONS
  }
}

export function useFolderPositions() {
  const [positions, setPositions] = useState(getInitialPositions)

  // Save to localStorage whenever positions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    } catch {
      // Ignore storage write failures.
    }
  }, [positions])

  const updatePosition = (folderId, newPosition) => {
    // Snap position to grid
    const snappedPosition = {
      x: snapToGrid(newPosition.x),
      y: snapToGrid(newPosition.y),
    }
    setPositions((prev) => ({
      ...prev,
      [folderId]: snappedPosition,
    }))
  }

  const resetPositions = () => {
    setPositions(DEFAULT_POSITIONS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage write failures.
    }
  }

  return { positions, updatePosition, resetPositions, snapToGrid, GRID_SIZE }
}
