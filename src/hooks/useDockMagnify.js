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
      return
    }
    itemRefs.current[id] = node
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
    const pointerX = event.clientX
    const pointerY = event.clientY

    Object.values(itemRefs.current).forEach((node) => {
      const rect = node.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate distance from pointer to icon center
      const distanceX = Math.abs(pointerX - centerX)
      const distanceY = Math.abs(pointerY - centerY)
      
      // Only magnify if pointer is directly over the item
      // (within its bounding box with some tolerance)
      const isHovered = distanceX <= rect.width && distanceY <= rect.height
      
      const scale = isHovered ? 1.3 : 1

      // GSAP animate: smooth transition to target scale
      gsap.to(node, {
        scale,
        duration: 0.2,
        ease: 'power2.out',
      })
    })
  }

  /**
   * Pointer leave handler - called when mouse leaves dock container.
   * Reset all icons to normal size (scale: 1).
   */
  const onPointerLeave = () => {
    Object.values(itemRefs.current).forEach((node) => {
      gsap.to(node, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
      })
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
        y: -16,
        scaleX: currentScale * 1.02,
        scaleY: currentScale * 0.98,
        duration: 0.12,
        ease: 'power2.out',
      })
      .to(node, {
        y: 0,
        scaleX: currentScale,
        scaleY: currentScale,
        duration: 0.28,
        ease: 'bounce.out',
      })
  }

  return { registerItem, onPointerMove, onPointerLeave, jumpItem, itemRefs }
}
