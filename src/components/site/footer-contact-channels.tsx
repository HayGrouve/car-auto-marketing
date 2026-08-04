import { ExternalLink } from 'lucide-react'
import {
  COMPACT_VIBER_LABEL,
  ContactLineLink,
} from '#/components/site/contact-channel-link'
import { siteContent } from '#/data/site-content'
import { getDefaultContactLine } from '#/lib/contact-surface'

const channelLinkClassName =
  'inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline'

export function FooterContactChannels() {
  const line = getDefaultContactLine()
  const { mapsLink } = siteContent.contact

  return (
    <div className="flex flex-col gap-3">
      <ContactLineLink
        channel="phone"
        className={channelLinkClassName}
        iconClassName="size-4 shrink-0"
        line={line}
      />
      <ContactLineLink
        channel="viber"
        className={channelLinkClassName}
        compactViber
        iconClassName="size-4 shrink-0 text-[#7360f2]"
        line={line}
      />
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

export { COMPACT_VIBER_LABEL }
