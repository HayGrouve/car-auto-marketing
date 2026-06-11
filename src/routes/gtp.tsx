import { createFileRoute } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'
import { GtpPage } from '#/pages/gtp-page'

const seo = buildSeoHead({
  title: siteContent.seo.gtp.title,
  description: siteContent.seo.gtp.description,
  path: '/gtp',
})

export const Route = createFileRoute('/gtp')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: GtpPage,
})
