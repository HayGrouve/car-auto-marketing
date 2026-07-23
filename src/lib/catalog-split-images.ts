import type { Service, ServiceGroupDef } from '#/data/site-content'

type SplitImage = { image: string; imageAlt: string }

export function assertCompleteSplitImageMaps(
  gazSplitImages: Record<string, SplitImage>,
  remontiSplitImages: Record<string, SplitImage>,
  services: readonly Service[],
  groups: readonly ServiceGroupDef[],
): void {
  const gazIds = services.filter((service) => service.page === 'gaz').map((service) => service.id)

  for (const id of gazIds) {
    if (!(id in gazSplitImages)) {
      throw new Error(`Missing gaz image map entry: ${id}`)
    }
  }

  for (const key of Object.keys(gazSplitImages)) {
    if (!gazIds.includes(key)) {
      throw new Error(`Orphan gaz image map key: ${key}`)
    }
  }

  const groupIds = groups.map((group) => group.id)

  for (const id of groupIds) {
    if (!(id in remontiSplitImages)) {
      throw new Error(`Missing remonti image map entry: ${id}`)
    }
  }

  for (const key of Object.keys(remontiSplitImages)) {
    if (!groupIds.includes(key)) {
      throw new Error(`Orphan remonti image map key: ${key}`)
    }
  }
}
