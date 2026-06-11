import { createFileRoute } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'
import { KontaktiPage } from '#/pages/kontakti-page'

const seo = buildSeoHead({
  title: siteContent.seo.contacts.title,
  description: siteContent.seo.contacts.description,
  path: '/kontakti',
})

export const Route = createFileRoute('/kontakti')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: KontaktiPage,
})
