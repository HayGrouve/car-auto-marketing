import { imageAlts } from '#/data/site-content'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { assertCompleteSplitImageMaps } from '#/lib/catalog-split-images'

const REMONTI_GROUP_IMAGE = {
  'diagnostics-maintenance': {
    image: '/images/repairs-section.png',
    imageAlt: imageAlts.repairs,
  },
  'engine-drivetrain': {
    image: '/images/gtp-section.png',
    imageAlt: imageAlts.gtp,
  },
  'brakes-comfort': {
    image: '/images/trust-section.png',
    imageAlt: imageAlts.shop,
  },
} as const satisfies Record<
  (typeof remontiGroups)[number]['id'],
  { image: string; imageAlt: string }
>

const gazServices = servicesCatalog.filter((service) => service.page === 'gaz')

export const gazSplitImages = Object.fromEntries(
  gazServices.map((service) => [
    service.id,
    { image: '/images/repairs-section.png', imageAlt: imageAlts.gas },
  ]),
) as Record<(typeof gazServices)[number]['id'], { image: string; imageAlt: string }>

export const remontiSplitImages = Object.fromEntries(
  remontiGroups.map((group) => [group.id, REMONTI_GROUP_IMAGE[group.id]]),
) as Record<(typeof remontiGroups)[number]['id'], { image: string; imageAlt: string }>

assertCompleteSplitImageMaps(gazSplitImages, remontiSplitImages, servicesCatalog, remontiGroups)
