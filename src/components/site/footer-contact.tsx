import { Clock, MapPin } from 'lucide-react'
import { siteContent } from '#/data/site-content'

export function FooterContact() {
  const { address, hours } = siteContent.contact

  return (
    <div className="space-y-4 text-[#0a0a0a]">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#525252]">
          <MapPin aria-hidden className="size-4 shrink-0" />
          {siteContent.footer.contactHeading}
        </p>
        <p className="max-w-prose text-base leading-7 text-[#525252]">{address}</p>
      </div>

      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#525252]">
          <Clock aria-hidden className="size-4 shrink-0" />
          Работно време
        </p>
        <ul className="space-y-1 text-base leading-7 text-[#525252]">
          {hours.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
