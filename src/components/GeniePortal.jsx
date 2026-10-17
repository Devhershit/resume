import { useEffect, useRef } from 'react'
import { useGenieStore } from '../store/genieStore'
import { calculateGenieMesh } from '../utils/genieMath'

export function GeniePortal() {
  const animations = useGenieStore((state) => state.animations)
  const removeGenieAnimation = useGenieStore((state) => state.removeGenieAnimation)
  const canvasRef = useRef(null)
  const animationStatesRef = useRef(new Map())

  useEffect(() => {
    if (animations.length === 0) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr
      canvas.height = height * dpr
    }

    let rafId = null

    // Initialize start time for newly registered animations
    const now = performance.now()
    animations.forEach((anim) => {
      if (!animationStatesRef.current.has(anim.id)) {
        animationStatesRef.current.set(anim.id, {
          startTime: now,
          anim,
        })
      }
    })

    const render = (currentTime) => {
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      const completedIds = []

      animationStatesRef.current.forEach((state, id) => {
        const { anim, startTime } = state
        const durationMs = (anim.duration || 0.65) * 1000
        const elapsedRaw = (currentTime - startTime) / durationMs
        const elapsed = Math.min(1, Math.max(0, elapsedRaw))

        // Progress: 0.0 (open window) to 1.0 (minimized in dock)
        const progress = anim.type === 'minimize' ? elapsed : 1.0 - elapsed

        // Calculate dynamic mesh slices from the fluid Genie model
        const rows = calculateGenieMesh({
          initialRect: anim.windowRect,
          finalRect: anim.targetRect,
          progress,
          rowCount: 85,
        })

        if (rows.length > 0 && anim.snapshot) {
          // Smooth fade at the very tip (last 8% of suction / first 8% of emergence)
          let opacity = 1.0
          if (anim.type === 'minimize' && progress > 0.92) {
            opacity = Math.max(0, (1.0 - progress) / 0.08)
          } else if (anim.type === 'restore' && progress > 0.92) {
            opacity = Math.max(0, (1.0 - progress) / 0.08)
          }

          ctx.save()
          ctx.globalAlpha = opacity

          // Render subtle ambient drop shadow hugging the curved funnel
          if (rows.length > 4 && opacity > 0.08) {
            ctx.save()
            ctx.shadowColor = 'rgba(2, 6, 23, 0.28)'
            ctx.shadowBlur = 22 * opacity
            ctx.shadowOffsetY = 8 * opacity
            ctx.fillStyle = 'rgba(15, 23, 42, 0.06)'

            ctx.beginPath()
            ctx.moveTo(rows[0].xMin, rows[0].y)
            for (let i = 0; i < rows.length; i++) {
              ctx.lineTo(rows[i].xMax, rows[i].y)
            }
            for (let i = rows.length - 1; i >= 0; i--) {
              ctx.lineTo(rows[i].xMin, rows[i].y)
            }
            ctx.closePath()
            ctx.fill()
            ctx.restore()
          }

          // Render each horizontal slice with sub-pixel overlap to eliminate seams
          const snapshot = anim.snapshot
          const snapW = snapshot.width
          const snapH = snapshot.height

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const srcY = row.v * snapH
            const srcH = Math.max(0.1, (row.nextV - row.v) * snapH)

            ctx.drawImage(
              snapshot,
              0,
              srcY,
              snapW,
              srcH,
              row.xMin,
              row.y,
              row.width,
              row.height + 0.75 // 0.75px overlap prevents sub-pixel gaps
            )
          }

          // Subtle iridescent quartz edge highlight hugging curved funnel borders
          if (rows.length > 4 && opacity > 0.2) {
            ctx.save()
            ctx.lineWidth = 1
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * opacity})`

            // Left curved boundary
            ctx.beginPath()
            ctx.moveTo(rows[0].xMin, rows[0].y)
            for (let i = 1; i < rows.length; i++) {
              ctx.lineTo(rows[i].xMin, rows[i].y)
            }
            ctx.stroke()

            // Right curved boundary
            ctx.beginPath()
            ctx.moveTo(rows[0].xMax, rows[0].y)
            for (let i = 1; i < rows.length; i++) {
              ctx.lineTo(rows[i].xMax, rows[i].y)
            }
            ctx.stroke()
            ctx.restore()
          }

          ctx.restore()
        }

        if (elapsed >= 1.0) {
          completedIds.push(id)
          try {
            anim.onComplete?.()
          } catch (e) {
            console.error('Genie onComplete error:', e)
          }
        }
      })

      ctx.restore()

      // Clean up completed animations
      completedIds.forEach((id) => {
        animationStatesRef.current.delete(id)
        removeGenieAnimation(id)
      })

      if (animationStatesRef.current.size > 0) {
        rafId = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    rafId = requestAnimationFrame(render)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [animations, removeGenieAnimation])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
        display: animations.length === 0 ? 'none' : 'block',
      }}
      aria-hidden="true"
    />
  )
}
