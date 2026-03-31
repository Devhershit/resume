import { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { Maximize2, Minus, X } from 'lucide-react'
import { useWindowAnimation } from '../hooks/useWindowAnimation'

export function MacWindow({ windowData, onFocus, onClose, onMinimize, onToggleMaximize, onMove, onResize, children }) {
  const shellRef = useRef(null)
  const animationRef = useRef(null)
  const nodeRef = useRef(null)
  const dragRafRef = useRef(null)
  const pendingPositionRef = useRef(null)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const { animateClose } = useWindowAnimation(animationRef, windowData.sourceRect)
  const safeSize = windowData.size ?? { width: 560, height: 560 }
  const safePosition = windowData.position ?? { x: 140, y: 110 }

  const handleWindowKeyDown = async (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      await handleClose()
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(max-width: 768px)')
    const updateViewport = () => setIsMobileViewport(query.matches)

    updateViewport()
    query.addEventListener('change', updateViewport)

    return () => {
      query.removeEventListener('change', updateViewport)
    }
  }, [])

  const commitResize = () => {
    if (!shellRef.current || windowData.isMaximized) return
    onResize(windowData.id, {
      width: shellRef.current.offsetWidth,
      height: shellRef.current.offsetHeight,
    })
  }

  const handleClose = async () => {
    await animateClose(windowData.sourceRect)
    onClose(windowData.id)
  }

  const handleWindowDrag = (_, data) => {
    pendingPositionRef.current = isMobileViewport
      ? { x: safePosition.x, y: data.y }
      : { x: data.x, y: data.y }

    if (dragRafRef.current !== null) return

    dragRafRef.current = window.requestAnimationFrame(() => {
      dragRafRef.current = null
      if (!pendingPositionRef.current) return
      onMove(windowData.id, pendingPositionRef.current)
      pendingPositionRef.current = null
    })
  }

  useEffect(() => {
    return () => {
      if (dragRafRef.current !== null) {
        window.cancelAnimationFrame(dragRafRef.current)
      }
    }
  }, [])

  const shellStyle = windowData.isMaximized
    ? {
        width: '100%',
        height: 'calc(var(--app-viewport-height, 100svh) - var(--window-maximized-offset, 112px))',
      }
    : {
        width: safeSize.width,
        height: safeSize.height,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(var(--app-viewport-height, 100svh) - var(--window-default-offset, 70px))',
        minWidth: 'min(280px, calc(100vw - 16px))',
        minHeight: 'min(240px, calc(var(--app-viewport-height, 100svh) - var(--window-default-offset, 70px)))',
        resize: 'both',
      }

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={windowData.isMaximized}
      axis={isMobileViewport ? 'y' : 'both'}
      handle=".window-handle"
      cancel=".window-control-button"
      position={windowData.isMaximized ? { x: 0, y: 54 } : safePosition}
      onStart={() => onFocus(windowData.id)}
      onDrag={handleWindowDrag}
      onStop={handleWindowDrag}
    >
      <article
        ref={nodeRef}
        className="pointer-events-auto absolute"
        style={{ zIndex: windowData.zIndex }}
        role="dialog"
        aria-label={`${windowData.title} window`}
        aria-modal="false"
        tabIndex={0}
        onKeyDown={handleWindowKeyDown}
        onMouseDown={() => onFocus(windowData.id)}
      >
        <div
          ref={animationRef}
          className="h-full"
          style={{ transformOrigin: 'center center' }}
        >
          <section
            ref={shellRef}
            onMouseUp={commitResize}
            style={shellStyle}
            className="window-shell overflow-hidden rounded-2xl border border-white/45 bg-white/65 shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur-[18px]"
          >
            <header className="window-handle pointer-events-auto flex cursor-move items-center justify-between border-b border-slate-300/60 bg-slate-100/65 px-3 py-2">
              <div className="window-controls pointer-events-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="window-control-button group relative flex h-11 w-11 items-center justify-center md:h-3.5 md:w-3.5"
                  aria-label="Close window"
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F57]" />
                  <X size={10} className="pointer-events-none absolute opacity-0 transition-opacity md:group-hover:opacity-100" />
                </button>
                <button
                  type="button"
                  onClick={() => onMinimize(windowData.id)}
                  className="window-control-button group relative flex h-11 w-11 items-center justify-center md:h-3.5 md:w-3.5"
                  aria-label="Minimize window"
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-[#FEBC2E]" />
                  <Minus size={10} className="pointer-events-none absolute opacity-0 md:group-hover:opacity-100" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleMaximize(windowData.id)}
                  className="window-control-button group relative flex h-11 w-11 items-center justify-center md:h-3.5 md:w-3.5"
                  aria-label="Maximize window"
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-[#28C840]" />
                  <Maximize2 size={9} className="pointer-events-none absolute opacity-0 md:group-hover:opacity-100" />
                </button>
              </div>
              <h2 className="pr-2 text-xs font-semibold tracking-wide text-slate-700">{windowData.title}</h2>
            </header>

            <div className="window-content-scroll h-[calc(100%-40px)] overflow-auto bg-white/55">{children}</div>
          </section>
        </div>
      </article>
    </Draggable>
  )
}
