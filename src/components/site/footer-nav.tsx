import { Link } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'

const footerNavLinkClassName =
  'text-sm text-[#525252] hover:text-[#1e3a8a]'

export function FooterNav() {
  return (
    <nav aria-label="Футър навигация" className="mt-6 space-y-2">
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
