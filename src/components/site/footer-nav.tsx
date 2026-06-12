import { Link } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'

const footerNavLinkClassName =
  'block text-sm text-[#525252] hover:text-[#1e3a8a]'

export function FooterNav() {
  return (
    <nav aria-label="Футър навигация" className="mt-6 flex flex-col gap-3">
      {siteContent.navigation.map((item) => (
        <Link
          className={footerNavLinkClassName}
          key={item.to}
          to={item.to}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
