import { useRef } from 'react'
import gsap from 'gsap'

export function useDockMagnify() {
  const itemRefs = useRef({})

  const registerItem = (id, node) => {
    if (!node) {
      delete itemRefs.current[id]
      return
    }
    itemRefs.current[id] = node
  }

  const onPointerMove = (event) => {
    const pointerX = event.clientX
    const pointerY = event.clientY

    Object.values(itemRefs.current).forEach((node) => {
      const rect = node.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distanceX = Math.abs(pointerX - centerX)
      const distanceY = Math.abs(pointerY - centerY)
      
      // Only magnify if pointer is directly over the item (within its bounds with some tolerance)
      const isHovered = distanceX <= rect.width && distanceY <= rect.height
      
      const scale = isHovered ? 1.3 : 1

      gsap.to(node, {
        scale,
        duration: 0.2,
        ease: 'power2.out',
      })
    })
  }

  const onPointerLeave = () => {
    Object.values(itemRefs.current).forEach((node) => {
      gsap.to(node, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
      })
    })
  }

  return { registerItem, onPointerMove, onPointerLeave, itemRefs }
}
