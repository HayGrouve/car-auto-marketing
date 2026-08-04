import { createFileRoute } from '@tanstack/react-router'
import { pageRouteHead } from '#/lib/page-route'
import { GazPage } from '#/pages/gaz-page'

export const Route = createFileRoute('/gaz')({
  head: () => {
    const seo = pageRouteHead('/gaz')
    return {
      meta: seo.meta,
      links: seo.links,
    }
  },
  component: GazPage,
})
