import { writeFile } from 'node:fs/promises'
import siteDefaults from '../site.defaults.json' with { type: 'json' }

const siteUrl = (process.env.VITE_SITE_URL ?? siteDefaults.siteUrl).replace(/\/$/, '')
const paths = ['/', '/gtp', '/remonti', '/kontakti']

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url>\n    <loc>${siteUrl}${p === '/' ? '' : p}</loc>\n  </url>`).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

await writeFile('public/sitemap.xml', sitemap)
await writeFile('public/robots.txt', robots)
console.log(`SEO files generated for ${siteUrl}`)
