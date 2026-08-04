const projects = [
  {
    title: 'AI-Powered Wildfire Detection System',
    description: 'Architected a hybrid machine learning pipeline for accurate fire classification (React.js, FastAPI, CNN, Streamlit).',
  },
  {
    title: 'METAR-Sense (Aero Guard)',
    description: 'Developed an AI-powered aviation weather reasoning tool leveraging LLMs to parse and interpret complex atmospheric feeds (Python, NLP).',
  },
  {
    title: 'GTA-6 Showcase Website',
    description: 'Programmed a highly interactive React.js web application utilizing advanced DOM manipulation and dynamic styling (React.js, GSAP).',
  },
  {
    title: 'Real-Time JS Weather App',
    description: 'Integrated third-party RESTful APIs using asynchronous JavaScript to render live meteorological data across 200,000+ locations.',
  },
  {
    title: 'React Portfolio',
    description: 'Personal portfolio built in React with responsive design, window management and component architecture.',
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
