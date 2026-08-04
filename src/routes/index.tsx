import { createFileRoute } from '@tanstack/react-router'
import { pageRouteHead } from '#/lib/page-route'
import { HomePage } from '#/pages/home-page'

export const Route = createFileRoute('/')({
  head: () => {
    const seo = pageRouteHead('/')
    return {
      meta: seo.meta,
      links: seo.links,
    }
  },
  component: HomePage,
})
