import britishAirwaysCertificatePdf from '../../work img/brithish airways certificate.pdf'
import eaCertificatePdf from '../../work img/ea certificate.pdf'
import geAerospaceCertificatePdf from '../../work img/ge aerospace.pdf'
import genAiCertificatePdf from '../../work img/gen ai certificate.pdf'
import jpMorganCertificatePdf from '../../work img/jp morgn certificate.pdf'

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
    title: 'Gen AI Certificate',
    provider: 'Generative AI',
    code: 'See certificate',
    date: 'March 2026',
    certificateUrl: genAiCertificatePdf,
  },
]

const jobSimulations = [
  {
    title: 'British Airways Job Simulation',
    provider: 'British Airways',
    code: 'Certificate PDF',
    date: 'See certificate',
    certificateUrl: britishAirwaysCertificatePdf,
  },
  {
    title: 'EA Job Simulation',
    provider: 'Electronic Arts',
    code: 'Certificate PDF',
    date: 'See certificate',
    certificateUrl: eaCertificatePdf,
  },
  {
    title: 'GE Aerospace Job Simulation',
    provider: 'GE Aerospace',
    code: 'Certificate PDF',
    date: 'See certificate',
    certificateUrl: geAerospaceCertificatePdf,
  },
  {
    title: 'J.P. Morgan Job Simulation',
    provider: 'J.P. Morgan',
    code: 'Certificate PDF',
    date: 'See certificate',
    certificateUrl: jpMorganCertificatePdf,
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

        <div className="mt-8 border-t border-slate-200 pt-5">
          <h4 className="text-lg font-semibold text-slate-900">Job Simulation</h4>

          <div className="mt-4 space-y-3">
            {jobSimulations.map((item) => (
              <article key={`${item.title}-${item.provider}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h5 className="font-semibold text-slate-900">{item.title}</h5>
                <p className="mt-1 text-sm text-slate-700">{item.provider}</p>
                <p className="mt-1 text-xs text-slate-500">Code: {item.code}</p>
                <p className="mt-1 text-xs text-slate-500">Completed: {item.date}</p>
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-sky-700 underline"
                >
                  View certificate
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
