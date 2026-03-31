import { FOLDER_ORDER, WINDOW_DEFINITIONS } from '../data/windows'
import { FolderIcon } from '../icons/FolderIcon'

const folderLookup = new Map(WINDOW_DEFINITIONS.map((item) => [item.id, item]))

function FolderItem({ id, onOpenFolder, onPrefetchFolder }) {
  const folder = folderLookup.get(id)
  if (!folder) return null

  const handleClick = (event) => {
    onOpenFolder(folder)(event)
  }

  return (
    <div className="desktop-folder-item pointer-events-auto w-20 select-none sm:w-24">
      <button
        type="button"
        className="flex w-full flex-col items-center gap-2 rounded-xl p-2 text-white/95 outline-none"
        onClick={handleClick}
        onPointerEnter={() => onPrefetchFolder?.(folder.id)}
        onFocus={() => onPrefetchFolder?.(folder.id)}
        aria-label={`Open ${folder.title}`}
      >
        <FolderIcon className="desktop-folder-icon h-12 w-12 sm:h-16 sm:w-16" />
        <span className="desktop-folder-label px-2 py-0.5 text-center text-xs font-medium tracking-wide text-white/95">
          {folder.title}
        </span>
      </button>
    </div>
  )
}

export function DesktopGrid({ onOpenFolder, onPrefetchFolder }) {
  return (
    <div className="app-desktop-grid pointer-events-none fixed inset-0 top-12">
      <div className="app-desktop-folders pointer-events-none absolute left-2 top-3 max-h-[calc(100svh-64px)] overflow-y-auto sm:left-4 sm:top-5">
        <div className="pointer-events-auto flex flex-col gap-2 sm:gap-3">
          {FOLDER_ORDER.map((id) => (
            <FolderItem
              key={id}
              id={id}
              onOpenFolder={onOpenFolder}
              onPrefetchFolder={onPrefetchFolder}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
