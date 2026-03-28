import mailLiquidIcon from '../../icons/mail-liquid.png'
import phoneLiquidIcon from '../../icons/phone-liquid.png'
import mapsLiquidIcon from '../../icons/maps-liquid.png'

export function ContactContent() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white/90 p-6">
        <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
        <p className="mt-2 text-sm text-slate-600">Open to internships, entry-level opportunities, and collaborations.</p>

        <ul className="mt-5 space-y-3 text-sm text-slate-700">
          <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <img src={mailLiquidIcon} alt="Mail" className="h-8 w-8 rounded-md object-cover" />
            <span>harshitgahlawat33@gmail.com</span>
          </li>
          <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <img src={phoneLiquidIcon} alt="Phone" className="h-8 w-8 rounded-md object-cover" />
            <span>+91-7011095547</span>
          </li>
          <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <img src={mapsLiquidIcon} alt="Location" className="h-8 w-8 rounded-md object-cover" />
            <span>Faridabad, Haryana, India</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
