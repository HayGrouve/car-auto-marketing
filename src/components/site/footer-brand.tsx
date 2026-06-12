import { siteContent } from '#/data/site-content'

export function FooterBrand() {
  return (
    <div className="space-y-2">
      <p className="text-lg font-extrabold text-[#1e3a8a]">
        {siteContent.brandName}
      </p>
      <p className="max-w-xs text-sm text-[#525252]">
        {siteContent.footer.tagline}
      </p>
    </div>
  )
}
