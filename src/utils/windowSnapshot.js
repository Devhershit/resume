import * as htmlToImage from 'html-to-image'

// Cache of window snapshots keyed by window ID
const snapshotCache = new Map()

/**
 * Creates an instant fallback canvas snapshot of a macOS window.
 * High-DPR, pixel-accurate rendering tailored to the specific window type.
 *
 * @param {HTMLElement|null} element - The window DOM element
 * @param {string} title - The window title
 * @param {string} windowId - The window identifier
 * @returns {HTMLCanvasElement}
 */
export function createFallbackSnapshot(element, title = '', windowId = '') {
  const rect = element ? element.getBoundingClientRect() : { width: 560, height: 500 }
  const width = Math.max(280, Math.round(rect.width))
  const height = Math.max(240, Math.round(rect.height))

  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
  const canvas = document.createElement('canvas')
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')

  if (!ctx) return canvas

  ctx.scale(dpr, dpr)

  const isDark = windowId === 'terminal'
  const radius = 16

  // Window shell background with rounded corners
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(0, 0, width, height, radius)
  ctx.clip()

  // Background body
  if (isDark) {
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)
  } else {
    // Glassmorphic translucent white gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
    bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    bgGrad.addColorStop(1, 'rgba(248, 250, 252, 0.92)')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)
  }

  // Liquid Glass Header bar
  if (isDark) {
    const hdrGrad = ctx.createLinearGradient(0, 0, 0, 40)
    hdrGrad.addColorStop(0, 'rgba(30, 41, 59, 0.85)')
    hdrGrad.addColorStop(1, 'rgba(15, 23, 42, 0.65)')
    ctx.fillStyle = hdrGrad
  } else {
    const hdrGrad = ctx.createLinearGradient(0, 0, 0, 40)
    hdrGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
    hdrGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.60)')
    hdrGrad.addColorStop(1, 'rgba(255, 255, 255, 0.40)')
    ctx.fillStyle = hdrGrad
  }
  ctx.fillRect(0, 0, width, 40)

  // Liquid glass header bottom border
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
  ctx.fillRect(0, 39, width, 1)

  // Liquid glass specular top highlight
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.95)'
  ctx.fillRect(0, 0, width, 1.5)

  // macOS Traffic light buttons
  const buttons = [
    { x: 18, color: '#FF5F57', border: '#E0443E' },
    { x: 36, color: '#FEBC2E', border: '#D89E24' },
    { x: 54, color: '#28C840', border: '#1AAB29' },
  ]
  buttons.forEach(({ x, color, border }) => {
    ctx.beginPath()
    ctx.arc(x, 20, 6, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.lineWidth = 0.5
    ctx.strokeStyle = border
    ctx.stroke()
  })

  // Window title
  const displayTitle = title || windowId.charAt(0).toUpperCase() + windowId.slice(1)
  ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillStyle = isDark ? '#e2e8f0' : '#334155'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(displayTitle, width / 2, 20)

  // Window inner body graphics customized by app type
  if (isDark) {
    // Terminal window prompt & command lines
    ctx.fillStyle = '#22c55e'
    ctx.font = '500 13px ui-monospace, monospace'
    ctx.textAlign = 'left'
    ctx.fillText('harshit@portfolio:~$ neofetch', 24, 70)

    ctx.fillStyle = '#64748b'
    ctx.font = '400 12px ui-monospace, monospace'
    ctx.fillText('OS: Harshit macOS Sonoma Web Edition', 24, 96)
    ctx.fillText('Host: React 19 + Tailwind v4 + GSAP Engine', 24, 116)
    ctx.fillText('Uptime: Active & Ready', 24, 136)

    ctx.fillStyle = '#38bdf8'
    ctx.fillText('harshit@portfolio:~$ _', 24, 168)

    // Glowing cursor
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'
    ctx.fillRect(190, 156, 8, 14)
  } else if (windowId === 'safari') {
    // Safari address bar
    ctx.fillStyle = '#e2e8f0'
    ctx.beginPath()
    ctx.roundRect(width * 0.15, 52, width * 0.7, 28, 8)
    ctx.fill()

    ctx.fillStyle = '#64748b'
    ctx.font = '500 11px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🔒 https://harshit.dev/certifications', width / 2, 66)

    // Certificate card silhouettes
    for (let row = 0; row < 2; row++) {
      const cardY = 96 + row * 130
      ctx.fillStyle = '#f8fafc'
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(24, cardY, width - 48, 110, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#0284c7'
      ctx.fillRect(40, cardY + 20, 36, 36)
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(90, cardY + 24, Math.min(220, width - 150), 12)
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(90, cardY + 44, Math.min(140, width - 150), 10)
    }
  } else if (windowId === 'photos') {
    // Photos album grid silhouettes
    const cols = width > 420 ? 3 : 2
    const cellW = (width - 48 - (cols - 1) * 16) / cols
    const cellH = cellW * 0.75
    const colors = ['#f472b6', '#38bdf8', '#a78bfa', '#fb923c', '#4ade80', '#fbbf24']

    for (let i = 0; i < Math.min(cols * 2, colors.length); i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const cx = 24 + col * (cellW + 16)
      const cy = 60 + row * (cellH + 16)

      ctx.fillStyle = colors[i]
      ctx.beginPath()
      ctx.roundRect(cx, cy, cellW, cellH, 10)
      ctx.fill()
    }
  } else {
    // General elegant window layout with header and content cards
    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(24, 60, Math.min(240, width - 48), 24)

    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(24, 94, Math.min(320, width - 48), 12)
    ctx.fillRect(24, 114, Math.min(200, width - 48), 10)

    // Content cards
    for (let c = 0; c < 2; c++) {
      const cy = 144 + c * 110
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(24, cy, width - 48, 92, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#0ea5e9'
      ctx.fillRect(40, cy + 20, 8, 28)
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(58, cy + 22, Math.min(180, width - 120), 12)
      ctx.fillStyle = '#64748b'
      ctx.fillRect(58, cy + 42, Math.min(260, width - 120), 10)
    }
  }

  ctx.restore()

  return canvas
}

/**
 * Captures or pre-warms a window snapshot.
 */
export function prewarmWindowSnapshot(element, { windowId, title }) {
  if (!element || !windowId) return

  setTimeout(async () => {
    try {
      const canvas = await htmlToImage.toCanvas(element, {
        pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
        skipFonts: true,
        fontEmbedCSS: '',
        cacheBust: false,
      })
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        snapshotCache.set(windowId, canvas)
      }
    } catch {
      if (!snapshotCache.has(windowId)) {
        snapshotCache.set(windowId, createFallbackSnapshot(element, title, windowId))
      }
    }
  }, 200)
}

/**
 * Returns a cached snapshot if available, or immediately creates
 * an authentic procedural fallback snapshot. Guaranteed 0ms sync.
 */
export function getOrMakeWindowSnapshot(element, { windowId, title }) {
  if (snapshotCache.has(windowId)) {
    return snapshotCache.get(windowId)
  }
  const fallback = createFallbackSnapshot(element, title, windowId)
  snapshotCache.set(windowId, fallback)
  return fallback
}

export function getCachedSnapshot(windowId) {
  return snapshotCache.get(windowId) || null
}

export function clearSnapshot(windowId) {
  snapshotCache.delete(windowId)
}
