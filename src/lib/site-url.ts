import siteDefaults from '../../site.defaults.json'

export function getSiteUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL
  if (typeof envUrl === 'string' && envUrl.length > 0) {
    return envUrl.replace(/\/$/, '')
  }
  return siteDefaults.siteUrl
}
