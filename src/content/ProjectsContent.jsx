const projects = [
  {
    title: 'React Portfolio',
    description: 'Personal portfolio built in React with responsive design and component architecture.',
  },
  {
    title: 'Movie Sentiment Analyzer',
    description: 'Python + NLP project that classifies sentiment from text data with ML pipelines.',
  },
  {
    title: 'GTA-6 Showcase Website',
    description: 'Interactive React website with dynamic UI and animation-focused front-end experience.',
  },
  {
    title: 'JS Weather App',
    description: 'Vanilla JavaScript weather app using REST APIs and asynchronous real-time data fetching.',
  },
  {
    title: 'Apple Vision Pro Concept',
    description: 'Immersive UI concept website using HTML/CSS/JS with advanced animation effects.',
  },
  {
    title: 'Amazon Clone',
    description: 'E-commerce style frontend clone focused on modern layout, responsiveness, and UI flow.',
  },
]

export function ProjectsContent() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-900">Projects</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-[0_14px_24px_rgba(15,23,42,0.1)]"
          >
            <h4 className="font-semibold text-slate-900">{project.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
