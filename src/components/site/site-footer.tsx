import { siteContent } from '#/data/site-content'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e5e5e5] bg-white px-6 py-6 lg:px-10">
      <div className="flex flex-col gap-4 text-sm text-neutral-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-2">
        <p className="text-neutral-900">
          © {year} {siteContent.brandName}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            className="font-medium text-neutral-900 underline-offset-4 hover:underline"
            href={siteContent.contact.phoneHref}
          >
            {siteContent.contact.phoneDisplay}
          </a>
          <a
            className="font-medium text-[#7360f2] underline-offset-4 hover:underline"
            href={siteContent.contact.viberHref}
          >
            {siteContent.contact.viberLabel}
          </a>
        </div>
        <p>{siteContent.contact.address}</p>
      </div>
    </footer>
  )
}
