import { useRef } from 'react'
import gsap from 'gsap'

/**
 * Custom hook for macOS dock magnification effect.
 * Icons scale up (1.3×) when hovered, creating a "magnifying glass" visual.
 *
 * USAGE:
 * ```jsx
 * const { registerItem, onPointerMove, onPointerLeave, itemRefs } = useDockMagnify()
 *
 * return (
 *   <nav onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
 *     {items.map((item) => (
 *       <button key={item.id} ref={(node) => registerItem(item.id, node)}>
 *         Icon
 *       </button>
 *     ))}
 *   </nav>
 * )
 * ```
 *
 * @returns {Object} Methods and refs for dock magnification
 */
export function useDockMagnify() {
  const itemRefs = useRef({})
  const pointerRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(null)
  const scaleSettersRef = useRef({})

  const shouldReduceMotion = () =>
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /**
   * Registers a dock item element for magnification tracking.
   * Called from ref={} in render.
   *
   * @param {string} id - Item ID
   * @param {HTMLElement} node - DOM element or null (cleanup)
   */
  const registerItem = (id, node) => {
    if (!node) {
      delete itemRefs.current[id]
      delete scaleSettersRef.current[id]
      return
    }

    scaleSettersRef.current[id] = gsap.quickTo(node, 'scale', {
      duration: 0.16,
      ease: 'power2.out',
    })

    itemRefs.current[id] = node
  }

  const updateMagnify = () => {
    frameRef.current = null
    const pointerX = pointerRef.current.x
    const pointerY = pointerRef.current.y

    Object.entries(itemRefs.current).forEach(([id, node]) => {
      const rect = node.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = pointerX - centerX
      const dy = pointerY - centerY
      const distance = Math.hypot(dx, dy)
      const influenceRadius = rect.width * 1.6

      if (distance >= influenceRadius) {
        scaleSettersRef.current[id]?.(1)
        return
      }

      const influence = 1 - distance / influenceRadius
      const scale = 1 + influence * 0.3
      scaleSettersRef.current[id]?.(scale)
    })
  }

  /**
   * Pointer move handler - called on every mouse move within dock container.
   * Calculates distance from pointer to each icon center.
   * Icons directly under pointer scale to 1.3, others scale to 1.
   *
   * PERFORMANCE: Uses GSAP for smooth animation instead of direct DOM updates.
   *
   * @param {PointerEvent} event - Mouse/pointer move event
   */
  const onPointerMove = (event) => {
    pointerRef.current.x = event.clientX
    pointerRef.current.y = event.clientY

    if (frameRef.current !== null) return
    frameRef.current = window.requestAnimationFrame(updateMagnify)
  }

  /**
   * Pointer leave handler - called when mouse leaves dock container.
   * Reset all icons to normal size (scale: 1).
   */
  const onPointerLeave = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    Object.keys(itemRefs.current).forEach((id) => {
      scaleSettersRef.current[id]?.(1)
    })
  }

  /**
   * Triggers a macOS-style dock "jump" animation for an item.
   * Keeps the current magnified scale while jumping vertically.
   *
   * @param {string} id - Item ID
   */
  const jumpItem = (id) => {
    const node = itemRefs.current[id]
    if (!node) return
    if (shouldReduceMotion()) return

    const currentScale = Number(gsap.getProperty(node, 'scale')) || 1

    gsap.killTweensOf(node)
    gsap
      .timeline()
      .to(node, {
        y: -14,
        scaleX: currentScale * 1.02,
        scaleY: currentScale * 0.98,
        duration: 0.1,
        ease: 'power2.out',
      })
      .to(node, {
        y: 0,
        scaleX: currentScale,
        scaleY: currentScale,
        duration: 0.24,
        ease: 'bounce.out',
      })
  }

  return { registerItem, onPointerMove, onPointerLeave, jumpItem, itemRefs }
}
