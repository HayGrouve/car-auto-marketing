import { ExternalLink, Phone } from 'lucide-react'
import { siteContent } from '#/data/site-content'
import { getDefaultContactLine } from '#/lib/contact-context'
import { ViberIcon } from '#/components/site/viber-icon'

const channelLinkClassName =
  'inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

export function FooterContactChannels() {
  const line = getDefaultContactLine()
  const { mapsLink } = siteContent.contact

  return (
    <div className="flex flex-col gap-3">
      <a className={channelLinkClassName} href={line.phoneHref}>
        <Phone aria-hidden className="size-4 shrink-0" />
        {line.phoneDisplay}
      </a>
      <a className={channelLinkClassName} href={line.viberHref}>
        <ViberIcon className="size-4 shrink-0 text-[#7360f2]" />
        {COMPACT_VIBER_LABEL}
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
