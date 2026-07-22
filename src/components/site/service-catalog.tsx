import type { Service, ServiceGroupDef } from '#/data/site-content'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'
import { ServiceGroupSection } from '#/components/site/service-group-section'

type FlatProps = {
  variant: 'flat'
  heading: string
  services: Service[]
}

type GroupedProps = {
  variant: 'grouped'
  groups: Array<ServiceGroupDef & { services: Service[] }>
}

export type ServiceCatalogProps = FlatProps | GroupedProps

export function ServiceCatalog(props: ServiceCatalogProps) {
  return (
    <section className="px-6 py-12 lg:px-10 lg:py-16">
      {props.variant === 'flat' ? (
        <>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
            {props.heading}
          </h2>
          <ul className="mt-8 space-y-8">
            {props.services.map((service) => (
              <ServiceExpandableItem key={service.id} service={service} />
            ))}
          </ul>
        </>
      ) : (
        <div className="space-y-16">
          {props.groups.map((group) => (
            <ServiceGroupSection key={group.id} {...group} />
          ))}
        </div>
      )}
    </section>
  )
}
