import { describe, expect, it } from 'vitest'
import type { Service, ServiceGroupDef } from '#/data/site-content'
import { assertCompleteSplitImageMaps } from '#/lib/catalog-split-images'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { gazSplitImages, remontiSplitImages } from '#/data/catalog-split-images'

const sampleServices = [
  { id: 'g1', title: 'G1', summary: 'S', page: 'gaz' },
  { id: 'g2', title: 'G2', summary: 'S', page: 'gaz' },
] satisfies Service[]

const sampleGroups = [
  { id: 'grp-a', title: 'A', intro: 'I', serviceIds: [] },
  { id: 'grp-b', title: 'B', intro: 'I', serviceIds: [] },
] satisfies ServiceGroupDef[]

describe('assertCompleteSplitImageMaps', () => {
  it('passes for complete maps matching catalog ids', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        { g1: { image: '/a.png', imageAlt: 'Alt A' }, g2: { image: '/b.png', imageAlt: 'Alt B' } },
        {
          'grp-a': { image: '/a.png', imageAlt: 'Alt A' },
          'grp-b': { image: '/b.png', imageAlt: 'Alt B' },
        },
        sampleServices,
        sampleGroups,
      ),
    ).not.toThrow()
  })

  it('throws when a gaz service id is missing from the map', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        { g1: { image: '/a.png', imageAlt: 'Alt A' } },
        { 'grp-a': { image: '/a.png', imageAlt: 'Alt A' }, 'grp-b': { image: '/b.png', imageAlt: 'Alt B' } },
        sampleServices,
        sampleGroups,
      ),
    ).toThrow(/Missing gaz image map entry: g2/)
  })

  it('throws when a remonti group id is missing from the map', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        { g1: { image: '/a.png', imageAlt: 'Alt A' }, g2: { image: '/b.png', imageAlt: 'Alt B' } },
        { 'grp-a': { image: '/a.png', imageAlt: 'Alt A' } },
        sampleServices,
        sampleGroups,
      ),
    ).toThrow(/Missing remonti image map entry: grp-b/)
  })

  it('throws on orphan gaz map keys', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        {
          g1: { image: '/a.png', imageAlt: 'Alt A' },
          g2: { image: '/b.png', imageAlt: 'Alt B' },
          orphan: { image: '/x.png', imageAlt: 'X' },
        },
        {
          'grp-a': { image: '/a.png', imageAlt: 'Alt A' },
          'grp-b': { image: '/b.png', imageAlt: 'Alt B' },
        },
        sampleServices,
        sampleGroups,
      ),
    ).toThrow(/Orphan gaz image map key: orphan/)
  })

  it('validates real maps at module load', () => {
    const gazIds = servicesCatalog.filter((s) => s.page === 'gaz').map((s) => s.id)
    for (const id of gazIds) {
      expect(gazSplitImages[id]?.image).toMatch(/^\/images\//)
      expect(gazSplitImages[id]?.imageAlt.length).toBeGreaterThan(0)
    }
    for (const group of remontiGroups) {
      expect(remontiSplitImages[group.id]?.image).toMatch(/^\/images\//)
      expect(remontiSplitImages[group.id]?.imageAlt.length).toBeGreaterThan(0)
    }
  })
})
