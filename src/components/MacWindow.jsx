import { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { Maximize2, Minus, X } from 'lucide-react'
import gsap from 'gsap'
import { useWindowAnimation } from '../hooks/useWindowAnimation'
import { useGenieStore } from '../store/genieStore'
import { getOrMakeWindowSnapshot, prewarmWindowSnapshot } from '../utils/windowSnapshot'
import GlassSurface from './GlassSurface'

export function MacWindow({ windowData, onFocus, onClose, onMinimize, onToggleMaximize, onMove, onResize, children }) {
  const shellRef = useRef(null)
  const animationRef = useRef(null)
  const nodeRef = useRef(null)
  const dragRafRef = useRef(null)
  const pendingPositionRef = useRef(null)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const { animateClose } = useWindowAnimation(animationRef, windowData.sourceRect, windowData.skipOpenAnimation)
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

  // Pre-warm snapshot in background once window opens
  useEffect(() => {
    if (shellRef.current) {
      prewarmWindowSnapshot(shellRef.current, {
        windowId: windowData.id,
        title: windowData.title,
      })
    }
  }, [windowData.id, windowData.title])

  const handleMinimize = () => {
    const reduceMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !shellRef.current) {
      onMinimize(windowData.id)
      return
    }

    const windowRect = shellRef.current.getBoundingClientRect()

    // Find the corresponding dock button, or minimized tray, or fallback to dock center
    const dockItem = document.querySelector(`[data-dock-id="${windowData.id}"]`)
      || document.querySelector('.dock-minimized-tray')
      || document.querySelector('.app-dock-nav')
      || document.querySelector('.app-dock')

    const targetRect = dockItem?.getBoundingClientRect() || {
      left: window.innerWidth / 2 - 30,
      top: window.innerHeight - 80,
      width: 60,
      height: 60,
    }

    // Capture snapshot immediately (0ms sync)
    const snapshot = getOrMakeWindowSnapshot(shellRef.current, {
      windowId: windowData.id,
      title: windowData.title,
    })

    // Immediately hide the real DOM window during animation
    if (nodeRef.current) {
      nodeRef.current.style.opacity = '0'
      nodeRef.current.style.pointerEvents = 'none'
    }

    useGenieStore.getState().startGenieAnimation({
      windowId: windowData.id,
      type: 'minimize',
      windowRect,
      targetRect,
      snapshot,
      duration: 0.6,
      onComplete: () => {
        if (nodeRef.current) {
          nodeRef.current.style.opacity = '1'
          nodeRef.current.style.pointerEvents = 'auto'
        }
        onMinimize(windowData.id)

        // Play subtle dock bounce animation when window enters dock
        const dockBtn = document.querySelector(`[data-dock-id="${windowData.id}"]`)
        if (dockBtn) {
          gsap.fromTo(dockBtn, { y: -14 }, { y: 0, duration: 0.35, ease: 'bounce.out' })
        }
      },
    })
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
          {(() => {
            const isDark = windowData.id === 'terminal'
            const headerGlassClasses = isDark
              ? 'border-b border-white/10 bg-gradient-to-b from-slate-800/85 via-slate-850/75 to-slate-900/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] text-slate-200'
              : 'border-b border-white/50 bg-gradient-to-b from-white/75 via-white/50 to-white/35 backdrop-blur-2xl shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.3),0_2px_12px_rgba(0,0,0,0.03)] text-slate-800'

            return (
              <section
                ref={shellRef}
                onMouseUp={commitResize}
                style={shellStyle}
                className="window-shell flex flex-col overflow-hidden rounded-2xl border border-white/40 shadow-[0_24px_60px_rgba(2,6,23,0.35)]"
              >
                {/* Liquid Glass Header / Title Bar */}
                <header className="window-handle pointer-events-auto relative w-full cursor-move select-none shrink-0 border-b border-white/25">
                  <GlassSurface
                    width="100%"
                    height={42}
                    borderRadius={16}
                    className="pointer-events-auto w-full !rounded-none !rounded-t-2xl"
                    displace={0.5}
                    distortionScale={-180}
                    redOffset={0}
                    greenOffset={10}
                    blueOffset={20}
                    brightness={isDark ? 35 : 55}
                    opacity={isDark ? 0.75 : 0.88}
                    mixBlendMode="screen"
                  >
                    <div className="flex w-full items-center justify-between px-2">
                      {/* Window Controls */}
                      <div className="window-controls pointer-events-auto flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="window-control-button group relative flex h-11 w-11 items-center justify-center md:h-3.5 md:w-3.5"
                          aria-label="Close window"
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F57] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/10" />
                          <X size={10} className="pointer-events-none absolute opacity-0 transition-opacity md:group-hover:opacity-100 text-[#4A0002]" />
                        </button>
                        <button
                          type="button"
                          onClick={handleMinimize}
                          onMouseEnter={() => {
                            if (shellRef.current) {
                              prewarmWindowSnapshot(shellRef.current, {
                                windowId: windowData.id,
                                title: windowData.title,
                              })
                            }
                          }}
                          className="window-control-button group relative flex h-11 w-11 items-center justify-center md:h-3.5 md:w-3.5"
                          aria-label="Minimize window"
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-[#FEBC2E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/10" />
                          <Minus size={10} className="pointer-events-none absolute opacity-0 md:group-hover:opacity-100 text-[#5C3F00]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleMaximize(windowData.id)}
                          className="window-control-button group relative flex h-11 w-11 items-center justify-center md:h-3.5 md:w-3.5"
                          aria-label="Maximize window"
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-[#28C840] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/10" />
                          <Maximize2 size={9} className="pointer-events-none absolute opacity-0 md:group-hover:opacity-100 text-[#074712]" />
                        </button>
                      </div>

                      {/* Window Title */}
                      <h2
                        className={`relative z-10 pr-2 text-xs font-semibold tracking-wide ${
                          isDark
                            ? 'text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                            : 'text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
                        }`}
                      >
                        {windowData.title}
                      </h2>
                    </div>
                  </GlassSurface>
                </header>

                <div
                  className={`window-content-scroll flex-1 overflow-auto ${
                    isDark ? 'bg-slate-900/90 text-white' : 'bg-white/75'
                  } backdrop-blur-[24px]`}
                >
                  {children}
                </div>
              </section>
            )
          })()}
        </div>
      </article>
    </Draggable>
  )
}
