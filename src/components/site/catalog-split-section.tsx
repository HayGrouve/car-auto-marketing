import { ServiceExpandableItem } from '#/components/site/service-expandable-item'
import type { Service, ServiceGroupDef } from '#/data/site-content'
import { cn } from '#/lib/utils'

type CatalogSplitSectionProps =
  | {
      variant: 'service'
      service: Service
      image: string
      imageAlt: string
      reverse?: boolean
      mutedBackground?: boolean
      number?: string
    }
  | {
      variant: 'group'
      group: ServiceGroupDef & { services: Service[] }
      image: string
      imageAlt: string
      reverse?: boolean
      mutedBackground?: boolean
      number?: string
    }

export function CatalogSplitSection(props: CatalogSplitSectionProps) {
  const { image, imageAlt, reverse = false, mutedBackground = false, number } = props
  const headingId =
    props.variant === 'service' ? `service-${props.service.id}` : `group-${props.group.id}`

  return (
    <section
      aria-labelledby={headingId}
      className={cn(mutedBackground && 'bg-[#fafafa]')}
    >
      <div
        className={cn(
          'grid md:grid-cols-2',
          reverse && '[&>*:first-child]:md:order-2 [&>*:last-child]:md:order-1',
        )}
      >
        <div className="flex flex-col justify-center px-6 py-12 lg:px-10 lg:py-16">
          {number ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#1e3a8a]">
              {number}
            </p>
          ) : null}
          {props.variant === 'service' ? (
            <ul className="space-y-8">
              <ServiceExpandableItem
                service={props.service}
                showDetails={false}
                titleAs="h2"
              />
            </ul>
          ) : (
            <>
              <h2
                id={headingId}
                className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl"
              >
                {props.group.title}
              </h2>
              <p className="mt-4 max-w-prose text-base leading-7 text-[#525252]">
                {props.group.intro}
              </p>
            </>
          )}
        </div>
        <div className="aspect-[4/3] min-h-[280px] overflow-hidden md:aspect-auto md:min-h-[280px]">
          <img
            alt={imageAlt}
            className="h-full min-h-[280px] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:scale-[1.03]"
            decoding="async"
            loading="lazy"
            src={image}
          />
        </div>
      </div>
    </section>
  )
}
