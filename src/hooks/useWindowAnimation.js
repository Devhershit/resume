import { useLayoutEffect } from 'react'
import gsap from 'gsap'

/**
 * Calculates the offset vector from a target element to a source rectangle.
 * Used to animate windows "zooming in" from their source (folder/dock icon).
 *
 * @param {HTMLElement} element - The window DOM element
 * @param {DOMRect} sourceRect - Bounding rect of the source (folder/dock icon)
 * @returns {{x: number, y: number}} Offset distance in pixels
 */
function getOffsetFromSource(element, sourceRect) {
  if (!element || !sourceRect) {
    return { x: 0, y: 0 }
  }

  // Get center points of both source and target elements
  const targetRect = element.getBoundingClientRect()
  const sourceCenterX = sourceRect.left + sourceRect.width / 2
  const sourceCenterY = sourceRect.top + sourceRect.height / 2
  const targetCenterX = targetRect.left + targetRect.width / 2
  const targetCenterY = targetRect.top + targetRect.height / 2

  // Return the delta needed to move from target center to source center
  // (This creates the "zoom in from source" effect)
  return {
    x: sourceCenterX - targetCenterX,
    y: sourceCenterY - targetCenterY,
  }
}

/**
 * Custom hook that handles window open animation (zoom in from source)
 * and provides an animateClose function for closing (zoom out to target).
 *
 * Animation Flow:
 * 1. OPEN: Window starts at source location (scaled 0.1, offset set)
 *    → Animates to normal position (scale 1, offset 0) over 0.62s
 * 2. CLOSE: Runs in reverse to the target location
 *
 * @param {React.RefObject} windowRef - Ref to the window element
 * @param {DOMRect} sourceRect - Bounding rect of the source (folder/dock that triggered open)
 * @returns {{animateClose: Function}} Function to animate window closing
 */
export function useWindowAnimation(windowRef, sourceRect) {
  // Run animation on mount or when sourceRect changes
  useLayoutEffect(() => {
    if (!windowRef.current) return

    const reduceMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const element = windowRef.current

    if (reduceMotion) {
      gsap.set(element, { opacity: 1, scale: 1, x: 0, y: 0 })
      return
    }

    const offset = getOffsetFromSource(element, sourceRect)

    // GSAP animation: scale from 0.1 (tiny) to 1 (normal) while moving from offset to origin
    gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.1,
        x: offset.x,
        y: offset.y,
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.62, // Standard macOS window open duration
        ease: 'power3.out', // Easing: starts fast, ends slow (feels natural)
      },
    )
  }, [windowRef, sourceRect])

  /**
   * Animate window closing back to target rectangle.
   * Called when user clicks close button.
   *
   * @param {DOMRect} targetRect - Target location to close to (usually source)
   * @returns {Promise} Resolves when animation completes
   */
  const animateClose = (targetRect) => {
    const element = windowRef.current
    if (!element) return Promise.resolve()

    const reduceMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      gsap.set(element, { opacity: 0, scale: 1, x: 0, y: 0 })
      return Promise.resolve()
    }

    const offset = getOffsetFromSource(element, targetRect)

    return new Promise((resolve) => {
      gsap.to(element, {
        opacity: 0,
        scale: 0.16, // End even smaller than open start
        x: offset.x,
        y: offset.y,
        duration: 0.34, // Faster close than open (feels snappy)
        ease: 'power2.inOut',
        onComplete: resolve,
      })
    })
  }

  return { animateClose }
}
