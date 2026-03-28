import { useRef } from 'react'
import Draggable from 'react-draggable'
import { Maximize2, Minus, X } from 'lucide-react'
import { useWindowAnimation } from '../hooks/useWindowAnimation'

export function MacWindow({ windowData, onFocus, onClose, onMinimize, onToggleMaximize, onMove, onResize, children }) {
  const shellRef = useRef(null)
  const animationRef = useRef(null)
  const nodeRef = useRef(null)
  const { animateClose } = useWindowAnimation(animationRef, windowData.sourceRect)
  const safeSize = windowData.size ?? { width: 560, height: 560 }
  const safePosition = windowData.position ?? { x: 140, y: 110 }

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

  const shellStyle = windowData.isMaximized
    ? {
        width: '100%',
        height: 'calc(100svh - 112px)',
      }
    : {
        width: safeSize.width,
        height: safeSize.height,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100svh - 70px)',
        minWidth: 'min(280px, calc(100vw - 16px))',
        minHeight: 'min(240px, calc(100svh - 70px))',
        resize: 'both',
      }

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={windowData.isMaximized}
      handle=".window-handle"
      position={windowData.isMaximized ? { x: 0, y: 54 } : safePosition}
      onStart={() => onFocus(windowData.id)}
      onDrag={(_, data) => onMove(windowData.id, { x: data.x, y: data.y })}
      onStop={(_, data) => onMove(windowData.id, { x: data.x, y: data.y })}
    >
      <article ref={nodeRef} className="pointer-events-auto absolute" style={{ zIndex: windowData.zIndex }} onMouseDown={() => onFocus(windowData.id)}>
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
            <header className="window-handle flex cursor-move items-center justify-between border-b border-slate-300/60 bg-slate-100/65 px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF5F57]"
                  aria-label="Close window"
                >
                  <X size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <button
                  type="button"
                  onClick={() => onMinimize(windowData.id)}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FEBC2E]"
                  aria-label="Minimize window"
                >
                  <Minus size={10} className="opacity-0" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleMaximize(windowData.id)}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#28C840]"
                  aria-label="Maximize window"
                >
                  <Maximize2 size={9} className="opacity-0" />
                </button>
              </div>
              <h2 className="pr-2 text-xs font-semibold tracking-wide text-slate-700">{windowData.title}</h2>
            </header>

            <div className="h-[calc(100%-40px)] overflow-auto bg-white/55">{children}</div>
          </section>
        </div>
      </article>
    </Draggable>
  )
}
