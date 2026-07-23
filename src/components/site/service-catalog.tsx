import type { Service } from '#/data/site-content'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'

export type ServiceCatalogProps = {
  variant: 'flat'
  heading: string
  services: Service[]
}

export function ServiceCatalog({ heading, services }: ServiceCatalogProps) {
  return (
    <section className="px-6 py-12 lg:px-10 lg:py-16">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
        {heading}
      </h2>
      <ul className="mt-8 space-y-8">
        {services.map((service) => (
          <ServiceExpandableItem key={service.id} service={service} />
        ))}
      </ul>
    </section>
  )
}
