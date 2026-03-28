import { MacWindow } from './MacWindow'

export function WindowLayer({ windows, renderContent, onFocus, onClose, onMinimize, onToggleMaximize, onMove, onResize }) {
  const ordered = Object.values(windows)
    .filter((item) => item.isOpen && !item.isMinimized)
    .sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="pointer-events-none absolute inset-0">
      {ordered.map((windowData) => (
        <MacWindow
          key={windowData.id}
          windowData={windowData}
          onFocus={onFocus}
          onClose={onClose}
          onMinimize={onMinimize}
          onToggleMaximize={onToggleMaximize}
          onMove={onMove}
          onResize={onResize}
        >
          {renderContent(windowData.id)}
        </MacWindow>
      ))}
    </div>
  )
}
