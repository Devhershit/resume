const experience = [
  {
    role: 'Frontend Web Developer - Evian Engineering Pvt. Ltd.',
    period: 'Jan 2026 - Present',
    details:
      'Built a scalable B2B platform for engineering portfolios (ETP/STP/WTP), improved load performance, and implemented technical SEO for organic growth.',
    url: 'https://evn-beta.vercel.app/',
  },
  {
    role: 'Web Developer & SEO - Isha\'s Designer Studio',
    period: 'Dec 2024 - Jan 2025',
    details:
      'Led full website development, implemented semantic SEO, and improved mobile-first responsiveness and engagement metrics.',
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
            <p className="mt-2 text-sm text-slate-600">{item.details}</p>
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
          </article>
        ))}
      </div>
    </div>
  )
}
