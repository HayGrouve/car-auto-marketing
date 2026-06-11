import { createFileRoute } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'
import { RemontiPage } from '#/pages/remonti-page'

const seo = buildSeoHead({
  title: siteContent.seo.repairs.title,
  description: siteContent.seo.repairs.description,
  path: '/remonti',
})

export const Route = createFileRoute('/remonti')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: RemontiPage,
})
