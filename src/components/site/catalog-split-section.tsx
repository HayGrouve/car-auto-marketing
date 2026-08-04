import { ServiceExpandableItem } from '#/components/site/service-expandable-item'
import { SplitLayout } from '#/components/site/split-layout'
import type { Service, ServiceGroupDef } from '#/data/site-content'

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
    <SplitLayout
      ariaLabelledBy={headingId}
      content={
        props.variant === 'service' ? (
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
        )
      }
      image={image}
      imageAlt={imageAlt}
      mutedBackground={mutedBackground}
      number={number}
      reverse={reverse}
    />
  )
}
