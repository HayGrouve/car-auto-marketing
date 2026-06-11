import type { ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { SiteFooter } from '#/components/site/site-footer'
import { SiteHeader } from '#/components/site/site-header'
import { siteContent } from '#/data/site-content'
import appCss from '../styles.css?url'

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
        title: `${siteContent.brandName} | ГТП и ремонти в Ловеч`,
      },
      {
        name: 'description',
        content:
          'Годишен технически преглед и автосервизни ремонти в Ловеч с бърз телефонен контакт.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: RootNotFound,
})

function RootLayout() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}

function RootNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 lg:px-10">
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
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="bg">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
