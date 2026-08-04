import type { ReactNode } from 'react'
import { useEffect } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { SiteFooter } from '#/components/site/site-footer'
import { SiteHeader } from '#/components/site/site-header'
import { siteContent } from '#/data/site-content'
import { buildLocalBusinessJsonLd } from '#/lib/seo'
import appCss from '../styles.css?url'

const homeSeo = siteContent.seo.home
const defaultTitle = 'Stefi Auto Gas | ГТП и сервиз в Ловеч'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: defaultTitle,
      },
      {
        name: 'description',
        content: homeSeo.description,
      },
      {
        name: 'theme-color',
        content: '#1e3a8a',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: '32x32',
      },
      {
        rel: 'apple-touch-icon',
        href: '/logo192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: RootNotFound,
})

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Към съдържанието
      </a>
      <SiteHeader />
      <main className="min-h-screen bg-white" id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}

function RootNotFound() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Към съдържанието
      </a>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 lg:px-10" id="main-content">
        <div className="max-w-xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1e3a8a]">
            404
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0a0a0a] md:text-5xl">
            Страницата не е намерена
          </h1>
          <p className="text-base leading-7 text-[#525252] md:text-lg">
            Тази страница липсва. Върнете се към началото или се обадете — ще ви
            помогнем.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex items-center justify-center bg-[#1e3a8a] px-5 py-3 text-sm font-bold text-white hover:bg-[#1e40af] hover:text-white rounded-none"
              to="/"
            >
              Към началото
            </Link>
            <ContactChannelLink channel="phone" variant="solid" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  const jsonLd = JSON.stringify(buildLocalBusinessJsonLd())

  return (
    <html lang="bg">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{ __html: jsonLd }}
          type="application/ld+json"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
