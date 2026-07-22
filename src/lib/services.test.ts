import { describe, expect, it } from 'vitest'
import type { Service, ServiceGroupDef } from '#/data/site-content'
import {
  assertValidServiceCatalog,
  getRemontiGroupsWithServices,
  getServicesForPage,
} from '#/lib/services'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'

const sampleServices = [
  {
    id: 'a',
    title: 'A',
    summary: 'Summary A',
    page: 'gaz',
  },
  {
    id: 'b',
    title: 'B',
    summary: 'Summary B',
    page: 'remonti',
    groupId: 'g1',
  },
] satisfies Service[]

const sampleGroups = [
  { id: 'g1', title: 'G1', intro: 'Intro', serviceIds: ['b'] },
] satisfies ServiceGroupDef[]

describe('services helpers', () => {
  it('filters services by page preserving catalog order', () => {
    expect(getServicesForPage('gaz', sampleServices)).toEqual([sampleServices[0]])
  })

  it('resolves remonti groups with services in serviceIds order', () => {
    const groups = getRemontiGroupsWithServices(sampleServices, sampleGroups)
    expect(groups).toHaveLength(1)
    expect(groups[0]?.services.map((s) => s.id)).toEqual(['b'])
  })

  it('throws when a group references an unknown service id', () => {
    expect(() =>
      assertValidServiceCatalog(sampleServices, [
        { id: 'g1', title: 'G1', intro: 'Intro', serviceIds: ['missing'] },
      ]),
    ).toThrow(/unknown service id/i)
  })

  it('validates the real catalog once populated', () => {
    expect(() => assertValidServiceCatalog(servicesCatalog, remontiGroups)).not.toThrow()
    expect(servicesCatalog).toHaveLength(15)
  })
})
