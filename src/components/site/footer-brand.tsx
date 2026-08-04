import { siteContent } from '#/data/site-content'
import { SiteLogo } from '#/components/site/site-logo'

export function FooterBrand() {
  return (
    <div className="space-y-2">
      <SiteLogo
        imageClassName="size-12"
        linkToHome={false}
        wordmarkClassName="text-lg font-extrabold text-[#1e3a8a] normal-case tracking-normal"
      />
      <p className="max-w-xs text-sm text-[#525252]">
        {siteContent.footer.tagline}
      </p>
    </div>
  )
}
