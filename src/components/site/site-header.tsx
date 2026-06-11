import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { siteContent } from '#/data/site-content'

function SiteNavigation({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Основна навигация"
      className={className}
      data-testid="site-nav"
    >
      {siteContent.navigation.map((item) => (
        <Link
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          key={item.to}
          to={item.to}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function HeaderContactLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ContactChannelLink channel="phone" variant="solid" />
      <ContactChannelLink channel="viber" variant="outline" />
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b border-[#e5e5e5] bg-white px-6 py-4 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          className="font-semibold uppercase tracking-wide text-neutral-900"
          to="/"
        >
          {siteContent.brandName}
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <SiteNavigation className="flex items-center gap-6" />
          <HeaderContactLinks className="flex items-center gap-3" />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ContactChannelLink
            channel="phone"
            className="hidden px-4 py-2 sm:inline-flex"
            variant="solid"
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Отвори меню"
                className="rounded-none"
                size="default"
                type="button"
                variant="secondary"
              >
                <Menu aria-hidden className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="rounded-none" showCloseButton>
              <SheetHeader>
                <SheetTitle className="text-left uppercase">
                  {siteContent.brandName}
                </SheetTitle>
              </SheetHeader>
              <SiteNavigation className="flex flex-col gap-4 px-4" />
              <HeaderContactLinks className="flex flex-col gap-3 px-4" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
