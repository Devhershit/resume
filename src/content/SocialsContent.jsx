import instaLiquidIcon from '../../icons/insta-liquid.png'
import xLiquidIcon from '../../icons/x-liquid.png'
import githubLiquidIcon from '../../icons/github-liquid.png'
import linkedinLiquidIcon from '../../icons/linkedin-liquid.png'
import phoneLiquidIcon from '../../icons/phone-liquid.png'
import mailLiquidIcon from '../../icons/mail-liquid.png'

export function SocialsContent() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white/90 p-6">
        <h3 className="text-xl font-semibold text-slate-900">Socials</h3>
        <p className="mt-2 text-sm text-slate-600">Find me across platforms and message me directly.</p>

        <ul className="mt-5 space-y-3 text-sm text-slate-700">
          <li>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300"
            >
              <img src={instaLiquidIcon} alt="Instagram" className="h-8 w-8 rounded-md object-cover" />
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/harshit-gahlawat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300"
            >
              <img src={linkedinLiquidIcon} alt="LinkedIn" className="h-8 w-8 rounded-md object-cover" />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Devhershit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300"
            >
              <img src={githubLiquidIcon} alt="GitHub" className="h-8 w-8 rounded-md object-cover" />
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a
              href="https://x.com/CarbonClicks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300"
            >
              <img src={xLiquidIcon} alt="X" className="h-8 w-8 rounded-md object-cover" />
              <span>X</span>
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/917011095547"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300"
            >
              <img src={phoneLiquidIcon} alt="WhatsApp" className="h-8 w-8 rounded-md object-cover" />
              <span>WhatsApp</span>
            </a>
          </li>
          <li>
            <a
              href="mailto:harshitgahlawat33@gmail.com"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300"
            >
              <img src={mailLiquidIcon} alt="Mail" className="h-8 w-8 rounded-md object-cover" />
              <span>Mail</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
