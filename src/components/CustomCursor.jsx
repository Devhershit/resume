import { useEffect, useRef, useState } from 'react'

/**
 * CustomCursor
 * ============
 * Renders the custom-made black macOS cursor with authentic delayed "shake to find" enlargement.
 *
 * Requirements:
 * 1. Delayed enlargement: Does NOT enlarge prematurely. Requires deliberate, sustained shaking
 *    (minimum 320ms of continuous high-speed direction reversals) before enlarging.
 * 2. Normal movements, quick swipes, and brief twitches never trigger enlargement.
 * 3. Smooth transition via Tailwind (`transition-transform duration-150 ease-out origin-center`).
 * 4. Resets to default scale (~180ms) once shaking stops.
 */
export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isEnlarged, setIsEnlarged] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const lastPosRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(0)
  const recentMovesRef = useRef([])
  const shakeStartTimeRef = useRef()
  const resetTimerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    // Minimum duration of sustained vigorous shaking required before enlarging (in ms)
    const REQUIRED_SHAKE_DURATION_MS = 320
    const MIN_SHAKE_SPEED = 2.8 // px/ms
    const MIN_REVERSALS = 4 // Minimum number of direction reversals within rolling window

    const handleMouseMove = (e) => {
      const now = performance.now()
      const clientX = e.clientX
      const clientY = e.clientY

      if (!isVisible) {
        setIsVisible(true)
      }

      setPosition({ x: clientX, y: clientY })

      if (lastTimeRef.current > 0) {
        const dt = now - lastTimeRef.current

        // Ignore large jumps (e.g. window re-entry or background throttle)
        if (dt > 0 && dt < 100) {
          const dx = clientX - lastPosRef.current.x
          const dy = clientY - lastPosRef.current.y
          const distance = Math.hypot(dx, dy)
          const speed = distance / dt // pixels per millisecond

          // Keep a rolling history of recent movement vectors over the last 500ms
          const history = recentMovesRef.current
          history.push({ dx, dy, speed, time: now })

          // Prune moves older than 500ms
          while (history.length > 0 && now - history[0].time > 500) {
            history.shift()
          }

          // Count rapid direction reversals (dot product < -80 at high speed)
          let reversals = 0
          for (let i = 1; i < history.length; i++) {
            const prev = history[i - 1]
            const curr = history[i]
            const dot = prev.dx * curr.dx + prev.dy * curr.dy
            if (dot < -80 && curr.speed > MIN_SHAKE_SPEED && prev.speed > MIN_SHAKE_SPEED) {
              reversals++
            }
          }

          const isCurrentlyShaking = reversals >= MIN_REVERSALS && speed > MIN_SHAKE_SPEED

          if (isCurrentlyShaking) {
            // Mark start time if beginning a new sustained shake sequence
            if (shakeStartTimeRef.current === 0) {
              shakeStartTimeRef.current = now
            }

            const shakeDuration = now - shakeStartTimeRef.current

            // Only enlarge after shaking has been sustained for the required delay duration
            if (shakeDuration >= REQUIRED_SHAKE_DURATION_MS) {
              setIsEnlarged(true)

              // Clear and reset restore timer while shaking continues
              if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current)
              }
              resetTimerRef.current = setTimeout(() => {
                setIsEnlarged(false)
                shakeStartTimeRef.current = 0
                recentMovesRef.current = []
              }, 180)
            }
          } else {
            // If movement slows down or ceases to shake before reaching required duration, reset start timer
            if (speed < 1.8 && now - shakeStartTimeRef.current > 120) {
              shakeStartTimeRef.current = 0
            }
          }
        }
      }

      lastPosRef.current = { x: clientX, y: clientY }
      lastTimeRef.current = now
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      setIsEnlarged(false)
      shakeStartTimeRef.current = 0
      recentMovesRef.current = []
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
      lastTimeRef.current = 0
      shakeStartTimeRef.current = 0
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform"
      style={{
        transform: `translate3d(${position.x - 4}px, ${position.y - 3}px, 0)`,
      }}
      aria-hidden="true"
    >
      <div
        className={`origin-center transition-transform duration-150 ease-out select-none ${isEnlarged ? 'scale-[3.5]' : 'scale-100'
          }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        >
          <path
            d="M4 3 L4 19 L9 14 L13 22 L16 20 L12 12 L19 12 Z"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  )
}
