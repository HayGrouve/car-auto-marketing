import { siteContent } from '#/data/site-content'
import type { SitePath } from '#/data/site-content'

type BuildSeoHeadArgs = {
  title: string
  description: string
  path: SitePath
}

export const defaultOgImage = `${siteContent.siteUrl}/images/lovech-service-shop.png`

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
      { property: 'og:image', content: defaultOgImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: defaultOgImage },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: siteContent.brandName,
    telephone: siteContent.contact.phoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteContent.contact.address,
      addressLocality: siteContent.city,
      addressCountry: 'BG',
    },
    url: siteContent.siteUrl,
    image: defaultOgImage,
    openingHours: siteContent.contact.schemaOpeningHours,
  }
}
