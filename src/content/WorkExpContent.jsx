import drdoImg from '../../work img/drdo.jpeg'

const experience = [
  {
    role: 'AI/ML Intern - CFEES - DRDO',
    period: 'Jun 2026 - Jul 2026',
    details: 'Engineered an AI-powered wildfire detection system leveraging a hybrid inference pipeline (CNN + SFI). Architected a robust full-stack environment featuring a FastAPI backend and interactive React frontend.',
    image: drdoImg,
  },
  {
    role: 'Frontend Web Developer - Evian Engineering Pvt. Ltd.',
    period: 'Jan 2026 - Apr 2026',
    details:
      'Architected a scalable B2B corporate platform from the ground up, optimized frontend performance accelerating page load speeds by 30%, and integrated advanced technical SEO strategies.',
    url: 'https://evn-beta.vercel.app/',
  },
  {
    role: 'Web Developer & SEO Specialist - Isha\'s Designer Studio',
    period: 'Dec 2024 - Jan 2025',
    details:
      'Spearheaded end-to-end development of the official storefront, executed data-driven SEO strategies securing a 45% surge in organic traffic, and overhauled UI with a mobile-first approach.',
    url: 'https://ishadesignerstudio.vercel.app/',
  },
]

export function WorkExpContent() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-900">Work Experience</h3>
      <div className="mt-4 space-y-4">
        {experience.map((item) => (
          <article key={item.role} className="rounded-2xl border border-slate-200 bg-white/90 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-slate-900">{item.role}</h4>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.period}</span>
            </div>
            {item.details && <p className="mt-2 text-sm text-slate-600">{item.details}</p>}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-sky-700 underline"
              >
                {item.url}
              </a>
            )}
            {item.image && (
              <div className="mt-2">
                <a
                  href={item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-sky-700 underline"
                >
                  View Certificate
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
