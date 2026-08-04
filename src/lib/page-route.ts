import type { SitePath } from '#/data/site-content'
import { pageRegistry } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'

export function pageRouteHead(path: SitePath) {
  const entry = pageRegistry[path]
  return buildSeoHead({
    title: entry.seo.title,
    description: entry.seo.description,
    path,
  })
}

export const publicPaths = Object.keys(pageRegistry) as SitePath[]
