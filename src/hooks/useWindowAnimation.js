import { useLayoutEffect } from 'react'
import gsap from 'gsap'

function getOffsetFromSource(element, sourceRect) {
  if (!element || !sourceRect) {
    return { x: 0, y: 0 }
  }

  const targetRect = element.getBoundingClientRect()
  const sourceCenterX = sourceRect.left + sourceRect.width / 2
  const sourceCenterY = sourceRect.top + sourceRect.height / 2
  const targetCenterX = targetRect.left + targetRect.width / 2
  const targetCenterY = targetRect.top + targetRect.height / 2

  return {
    x: sourceCenterX - targetCenterX,
    y: sourceCenterY - targetCenterY,
  }
}

export function useWindowAnimation(windowRef, sourceRect) {
  useLayoutEffect(() => {
    if (!windowRef.current) return

    const element = windowRef.current
    const offset = getOffsetFromSource(element, sourceRect)

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
        duration: 0.62,
        ease: 'power3.out',
      },
    )
  }, [windowRef, sourceRect])

  const animateClose = (targetRect) => {
    const element = windowRef.current
    if (!element) return Promise.resolve()

    const offset = getOffsetFromSource(element, targetRect)

    return new Promise((resolve) => {
      gsap.to(element, {
        opacity: 0,
        scale: 0.16,
        x: offset.x,
        y: offset.y,
        duration: 0.34,
        ease: 'power2.inOut',
        onComplete: resolve,
      })
    })
  }

  return { animateClose }
}
