import type { ReactNode } from 'react'
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { siteContent } from '#/data/site-content'
import { getAllContactLines } from '#/lib/contact-context'
import { ViberIcon } from '#/components/site/viber-icon'

type ContactRowProps = {
  label: string
  icon?: ReactNode
  children: ReactNode
}

function ContactRow({ label, icon, children }: ContactRowProps) {
  return (
    <div className="space-y-2">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#525252]">
        {icon}
        {label}
      </p>
      {children}
    </div>
  )
}

export function ContactDetails() {
  const { address, hours, mapsLink } = siteContent.contact
  const lines = getAllContactLines()

  return (
    <div className="space-y-8 text-[#0a0a0a]">
      {lines.map((line) => (
        <div className="space-y-3" key={line.id}>
          <p className="text-xs font-bold uppercase tracking-widest text-[#525252]">
            {line.label}
          </p>
          <a
            aria-label={`${line.label}: ${line.phoneDisplay}`}
            className="inline-flex items-center gap-2 text-lg font-bold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
            href={line.phoneHref}
          >
            <Phone aria-hidden className="size-5 shrink-0" />
            {line.phoneDisplay}
          </a>
          <div className="space-y-1">
            <a
              className="inline-flex items-center gap-2 text-lg font-bold text-[#7360f2] underline-offset-4 hover:text-[#5a4fd1] hover:underline"
              href={line.viberHref}
            >
              <ViberIcon className="size-5 shrink-0" />
              {line.viberLabel}
            </a>
            <p className="text-sm text-[#525252]">Бързо съобщение</p>
          </div>
        </div>
      ))}

      <ContactRow
        icon={<MapPin aria-hidden className="size-4 shrink-0" />}
        label="Адрес"
      >
        <p className="max-w-prose text-base leading-7 text-[#525252]">{address}</p>
      </ContactRow>

      <ContactRow
        icon={<Clock aria-hidden className="size-4 shrink-0" />}
        label="Работно време"
      >
        <ul className="space-y-1 text-base leading-7 text-[#525252]">
          {hours.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </ContactRow>

      <a
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
        href={mapsLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLink aria-hidden className="size-4 shrink-0" />
        Отвори в Google Maps
      </a>
    </div>
  )
}
