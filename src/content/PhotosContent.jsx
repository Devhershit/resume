import project1 from '../../work img/project-1.png'
import project2 from '../../work img/project-2 (1).png'
import project3 from '../../work img/project-3.png'
import project4 from '../../work img/project-4.png'
import project5 from '../../work img/project-5.png'
import project6 from '../../work img/project-6.png'
import project7 from '../../work img/project-7.png'
import project8 from '../../work img/project-8.png'
import project9 from '../../work img/project-9.png'

const photos = [
  project1,
  project2,
  project3,
  project4,
  project5,
  project6,
  project7,
  project8,
  project9,
]

export function PhotosContent() {
  return (
    <div className="h-full overflow-auto bg-white/80 p-4">
      <h3 className="px-2 text-xl font-semibold text-slate-900">Photos</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((src, index) => (
          <figure
            key={src}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
          >
            <img
              src={src}
              alt={`Project photo ${index + 1}`}
              className="h-36 w-full object-cover md:h-44"
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </div>
  )
}
