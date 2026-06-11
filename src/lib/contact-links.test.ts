import { describe, expect, it } from 'vitest'
import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'

describe('contact-links', () => {
  it('builds tel href from E.164', () => {
    expect(buildPhoneHref('+359888000000')).toBe('tel:+359888000000')
  })

  it('builds viber href without plus sign', () => {
    expect(buildViberHref('+359888000000')).toBe('viber://chat?number=359888000000')
  })
})
