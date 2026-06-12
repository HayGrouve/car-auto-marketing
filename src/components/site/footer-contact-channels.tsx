import { ExternalLink, Phone } from 'lucide-react'
import { siteContent } from '#/data/site-content'
import { ViberIcon } from '#/components/site/viber-icon'

const channelLinkClassName =
  'inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline'

export function FooterContactChannels() {
  const { phoneHref, phoneDisplay, viberHref, viberLabel, mapsLink } =
    siteContent.contact

  return (
    <div className="flex flex-col gap-3">
      <a className={channelLinkClassName} href={phoneHref}>
        <Phone aria-hidden className="size-4 shrink-0" />
        {phoneDisplay}
      </a>
      <a className={channelLinkClassName} href={viberHref}>
        <ViberIcon className="size-4 shrink-0 text-[#7360f2]" />
        {viberLabel}
      </a>
      <a
        className={channelLinkClassName}
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
