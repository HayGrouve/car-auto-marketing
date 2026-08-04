import { createFileRoute } from '@tanstack/react-router'
import { pageRouteHead } from '#/lib/page-route'
import { KontaktiPage } from '#/pages/kontakti-page'

export const Route = createFileRoute('/kontakti')({
  head: () => {
    const seo = pageRouteHead('/kontakti')
    return {
      meta: seo.meta,
      links: seo.links,
    }
  },
  component: KontaktiPage,
})
