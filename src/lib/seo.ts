import { siteContent } from '#/data/site-content'
import type { SitePath } from '#/data/site-content'

type BuildSeoHeadArgs = {
  title: string
  description: string
  path: SitePath
}

export function buildSeoHead({
  title,
  description,
  path,
}: BuildSeoHeadArgs) {
  const canonical = `${siteContent.siteUrl}${path === '/' ? '' : path}`
  const fullTitle = `${title} | ${siteContent.brandName}`

  return {
    title: fullTitle,
    canonical,
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'bg_BG' },
      { property: 'og:url', content: canonical },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}
