import { FooterBrand } from '#/components/site/footer-brand'
import { FooterContact } from '#/components/site/footer-contact'
import { FooterNav } from '#/components/site/footer-nav'
import { siteContent } from '#/data/site-content'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e5e5e5] bg-white px-6 py-10 lg:px-10 lg:py-12">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <FooterBrand />
          <FooterNav />
        </div>
        <FooterContact />
      </div>
      <p className="mt-8 border-t border-[#e5e5e5] pt-6 text-xs text-[#525252]">
        © {year} {siteContent.brandName}
      </p>
    </footer>
  )
}
