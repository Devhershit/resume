import britishAirwaysCertificatePdf from '../../work img/brithish airways certificate.pdf'

const certifications = [
  {
    title: 'Programming with Python 3.X',
    provider: 'Simplilearn SkillUp',
    code: '9983721',
    date: 'March 2026',
  },
  {
    title: 'Artificial Intelligence Beginners Guide',
    provider: 'Simplilearn SkillUp',
    code: '9983773',
    date: 'March 2026',
  },
  {
    title: 'Effective Communication',
    provider: 'Great Learning Academy',
    code: 'Verify in resume',
    date: 'November 2024',
  },
  {
    title: 'British Airways Certificate',
    provider: 'British Airways',
    code: 'Verify in certificate',
    date: 'See certificate',
    certificateUrl: britishAirwaysCertificatePdf,
  },
]

export function SafariContent() {
  return (
    <div className="h-full overflow-auto bg-white/85 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">Certification</h3>
          <a
            href="/Harshit_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sky-700 underline"
          >
            Open full resume
          </a>
        </div>

        <p className="mt-2 text-sm text-slate-600">Certification courses pulled from your resume.</p>

        <div className="mt-5 space-y-3">
          {certifications.map((item) => (
            <article key={`${item.title}-${item.code}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-sm text-slate-700">{item.provider}</p>
              <p className="mt-1 text-xs text-slate-500">Code: {item.code}</p>
              <p className="mt-1 text-xs text-slate-500">Completed: {item.date}</p>
              {item.certificateUrl ? (
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-sky-700 underline"
                >
                  View certificate
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
