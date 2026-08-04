import { Download } from 'lucide-react'

export function ResumeContent() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        {/* Download Button */}
        <div className="mb-4 flex justify-center">
          <a
            href="/Harshit_Resume.pdf"
            download="Harshit_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            <Download size={16} />
            Download Resume
          </a>
        </div>

        {/* Resume Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_16px_34px_rgba(15,23,42,0.12)]">
          <iframe
            src="/Harshit_Resume.pdf"
            className="w-full h-[600px] md:h-[800px] lg:h-[1000px]"
            title="Resume PDF"
          />
        </div>

        {/* Fallback Info Card */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.12)]">
          <h3 className="text-2xl font-semibold text-slate-900">Harshit</h3>
          <p className="mt-1 text-sm text-slate-600">Software Engineering Student | Frontend + AI/ML | Faridabad</p>

          <section className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Profile</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Results-driven Software Developer and AI Specialist combining rigorous analytical problem-solving from an aviation background with
              modern web technologies (React.js, Python, JS). Proven ability to architect scalable applications, deploy machine learning models,
              process complex datasets, and thrive in precision-focused, fast-paced environments.
            </p>
          </section>

          <section className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Skills</h4>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Programming:</strong> C, Java, JavaScript (ES6+), Python, R, SQL<br />
              <strong>Web Dev:</strong> React.js, FastAPI, Vite, HTML5, CSS3, Tailwind CSS, GSAP, DOM Manipulation<br />
              <strong>AI &amp; Data:</strong> TensorFlow, PyTorch, CNN, Prompt Engineering, LLMs, NLP, Data Analysis, MySQL<br />
              <strong>Tools &amp; Cloud:</strong> Streamlit, Git, GitHub, REST APIs, OpenAI API, Gemini API, VSCode, Figma
            </p>
          </section>

          <section className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Education</h4>
            <p className="mt-2 text-sm text-slate-700">
              Dronacharya College of Engineering - B.Tech, Computer Science (AI &amp; ML), 2024 - 2028
            </p>
            <p className="mt-1 text-sm text-slate-700">D.A.V. Public School, Faridabad - Class 10/12, 2023</p>
          </section>

          <section className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Links</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>
                Portfolio:{' '}
                <a
                  href="https://harshit-portfolio-alpha-85.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 underline"
                >
                  harshit-portfolio-alpha-85.vercel.app
                </a>
              </li>
              <li>
                GitHub:{' '}
                <a
                  href="https://github.com/Devhershit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 underline"
                >
                  github.com/Devhershit
                </a>
              </li>
              <li>
                LinkedIn:{' '}
                <a
                  href="https://linkedin.com/in/harshit-gahlawat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 underline"
                >
                  linkedin.com/in/harshit-gahlawat
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
