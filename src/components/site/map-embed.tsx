import { siteContent } from '#/data/site-content'

export function MapEmbed() {
  return (
    <div
      className="overflow-hidden rounded-none border border-[#e5e5e5]"
      data-testid="contact-map"
    >
      <iframe
        className="h-[320px] w-full rounded-none border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={siteContent.contact.mapEmbedUrl}
        title="Карта до сервиза"
      />
    </div>
  )
}
