import type { Service, ServiceGroupDef } from '#/data/site-content'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'

type ServiceGroupSectionProps = ServiceGroupDef & { services: Service[] }

export function ServiceGroupSection({ title, intro, services }: ServiceGroupSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">{title}</h2>
      <p className="max-w-prose text-base leading-7 text-[#525252]">{intro}</p>
      <ul className="space-y-8">
        {services.map((service) => (
          <ServiceExpandableItem key={service.id} service={service} />
        ))}
      </ul>
    </section>
  )
}
