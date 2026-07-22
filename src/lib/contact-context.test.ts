import { describe, expect, it } from 'vitest'
import {
  getAllContactLines,
  getDefaultContactLine,
  resolveContactLine,
} from '#/lib/contact-context'

describe('resolveContactLine', () => {
  it('maps default and remonti to service, gtp to inspections', () => {
    expect(resolveContactLine('default').id).toBe('service')
    expect(resolveContactLine('remonti').id).toBe('service')
    expect(resolveContactLine('gtp').id).toBe('inspections')
  })

  it('returns inspections line with correct phone for gtp', () => {
    const line = resolveContactLine('gtp')
    expect(line.phoneDisplay).toBe('0876 105 674')
    expect(line.phoneHref).toBe('tel:+359876105674')
  })
})

describe('getDefaultContactLine', () => {
  it('returns the service line', () => {
    expect(getDefaultContactLine().id).toBe('service')
    expect(getDefaultContactLine().phoneDisplay).toBe('0876 689 736')
  })
})

describe('getAllContactLines', () => {
  it('returns lines in contractual order service, inspections, gas', () => {
    expect(getAllContactLines().map((line) => line.id)).toEqual([
      'service',
      'inspections',
      'gas',
    ])
  })
})
