import type { Service, ServiceGroupDef, ServicePage } from '#/data/site-content'

export function getServicesForPage(
  page: ServicePage,
  services: readonly Service[],
): Service[] {
  return services.filter((service) => service.page === page)
}

export function getRemontiGroupsWithServices(
  services: readonly Service[],
  groups: readonly ServiceGroupDef[],
): Array<ServiceGroupDef & { services: Service[] }> {
  const byId = new Map(services.map((service) => [service.id, service]))

  return groups.map((group) => ({
    ...group,
    services: group.serviceIds.map((id) => {
      const service = byId.get(id)
      if (!service) {
        throw new Error(`Missing service for group ${group.id}: ${id}`)
      }
      return service
    }),
  }))
}

export function assertValidServiceCatalog(
  services: readonly Service[],
  groups: readonly ServiceGroupDef[],
): void {
  const ids = services.map((s) => s.id)
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== ids.length) {
    throw new Error('Duplicate service id in catalog')
  }

  const byId = new Map(services.map((s) => [s.id, s]))
  const remontiServices = services.filter((s) => s.page === 'remonti')
  const assigned = new Set<string>()

  for (const group of groups) {
    for (const serviceId of group.serviceIds) {
      if (!byId.has(serviceId)) {
        throw new Error(`Group ${group.id} references unknown service id: ${serviceId}`)
      }
      if (assigned.has(serviceId)) {
        throw new Error(`Service ${serviceId} assigned to multiple groups`)
      }
      assigned.add(serviceId)
    }
  }

  for (const service of remontiServices) {
    if (!service.groupId) {
      throw new Error(`Remonti service ${service.id} missing groupId`)
    }
    if (!groups.some((g) => g.id === service.groupId)) {
      throw new Error(`Remonti service ${service.id} has unknown groupId ${service.groupId}`)
    }
    if (!assigned.has(service.id)) {
      throw new Error(`Remonti service ${service.id} not listed in any group`)
    }
  }

  if (assigned.size !== remontiServices.length) {
    throw new Error('Remonti group service count mismatch')
  }
}
