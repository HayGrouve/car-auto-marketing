import { createFileRoute } from '@tanstack/react-router'
import { pageRouteHead } from '#/lib/page-route'
import { RemontiPage } from '#/pages/remonti-page'

export const Route = createFileRoute('/remonti')({
  head: () => {
    const seo = pageRouteHead('/remonti')
    return {
      meta: seo.meta,
      links: seo.links,
    }
  },
  component: RemontiPage,
})
