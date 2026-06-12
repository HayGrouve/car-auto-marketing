import { afterEach, describe, expect, it, vi } from 'vitest'
import siteDefaults from '../../site.defaults.json'

describe('getSiteUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('returns the fallback site url when VITE_SITE_URL is unset', async () => {
    vi.stubEnv('VITE_SITE_URL', '')
    const { getSiteUrl } = await import('#/lib/site-url')

    expect(getSiteUrl()).toBe(siteDefaults.siteUrl)
  })

  it('uses VITE_SITE_URL and strips a trailing slash', async () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.com/')
    const { getSiteUrl } = await import('#/lib/site-url')

    expect(getSiteUrl()).toBe('https://example.com')
  })
})
