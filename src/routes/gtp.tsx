import { createFileRoute } from '@tanstack/react-router'
import { pageRouteHead } from '#/lib/page-route'
import { GtpPage } from '#/pages/gtp-page'

export const Route = createFileRoute('/gtp')({
  head: () => {
    const seo = pageRouteHead('/gtp')
    return {
      meta: seo.meta,
      links: seo.links,
    }
  },
  component: GtpPage,
})
