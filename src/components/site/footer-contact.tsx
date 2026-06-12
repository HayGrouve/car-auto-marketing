import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { siteContent } from '#/data/site-content'
import { ViberIcon } from '#/components/site/viber-icon'

export function FooterContact() {
  const {
    phoneHref,
    phoneDisplay,
    viberHref,
    viberLabel,
    address,
    hours,
    mapsLink,
  } = siteContent.contact

  return (
    <div className="space-y-4 text-[#0a0a0a]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#525252]">
        {siteContent.footer.contactHeading}
      </p>

      <p className="inline-flex items-start gap-2 text-sm leading-6 text-[#525252]">
        <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
        {address}
      </p>

      <ul className="space-y-1 text-sm leading-6 text-[#525252]">
        {hours.map((row) => (
          <li className="inline-flex items-start gap-2" key={row}>
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
            {row}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
          href={phoneHref}
        >
          <Phone aria-hidden className="size-4 shrink-0" />
          {phoneDisplay}
        </a>
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7360f2] underline-offset-4 hover:text-[#5a4fd1] hover:underline"
          href={viberHref}
        >
          <ViberIcon className="size-4 shrink-0" />
          {viberLabel}
        </a>
      </div>

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
