import { createFileRoute } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'
import { GazPage } from '#/pages/gaz-page'

const seo = buildSeoHead({
  title: siteContent.seo.gaz.title,
  description: siteContent.seo.gaz.description,
  path: '/gaz',
})

export const Route = createFileRoute('/gaz')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: GazPage,
})
