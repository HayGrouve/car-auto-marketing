import { CtaBand } from '#/components/site/cta-band'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'
import { SplitSection } from '#/components/site/split-section'
import { gazSplitImages, remontiSplitImages } from '#/data/catalog-split-images'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import type { Service, ServicePage } from '#/data/site-content'
import { getServicePageEntry } from '#/data/site-content'
import { getRemontiGroupsWithServices, getServicesForPage } from '#/lib/services'

type ServiceDetailsCatalogProps = {
  heading: string
  services: Service[]
}

function ServiceDetailsCatalog({ heading, services }: ServiceDetailsCatalogProps) {
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

export type ServicePageViewProps = {
  page: ServicePage
}

export function ServicePageView({ page }: ServicePageViewProps) {
  const entry = getServicePageEntry(page)
  const { hero, sections, ctaBand } = entry.content
  const { contactContext, serviceLayout } = entry
  const detailsHeading = serviceLayout.detailsCatalogHeading

  if (serviceLayout.kind === 'static-splits') {
    const services = getServicesForPage(page, servicesCatalog)

    return (
      <>
        <HeroSection contactContext={contactContext} content={hero} />
        {sections.map((section, index) => (
          <Reveal key={section.title}>
            <SplitSection
              content={section}
              mutedBackground={index % 2 === 1}
              number={`0${index + 1}`}
              reverse={index % 2 === 1}
            />
          </Reveal>
        ))}
        <Reveal>
          <ServiceDetailsCatalog heading={detailsHeading} services={services} />
        </Reveal>
        <Reveal>
          <CtaBand
            contactContext={contactContext}
            subtitle={ctaBand.description}
            title={ctaBand.title}
          />
        </Reveal>
      </>
    )
  }

  if (serviceLayout.kind === 'service-splits') {
    const services = getServicesForPage(page, servicesCatalog)

    return (
      <>
        <HeroSection contactContext={contactContext} content={hero} />
        {services.map((service, index) => (
          <Reveal key={service.id}>
            <CatalogSplitSection
              image={gazSplitImages[service.id].image}
              imageAlt={gazSplitImages[service.id].imageAlt}
              mutedBackground={index % 2 === 1}
              number={`0${index + 1}`}
              reverse={index % 2 === 1}
              service={service}
              variant="service"
            />
          </Reveal>
        ))}
        <Reveal>
          <ServiceDetailsCatalog heading={detailsHeading} services={services} />
        </Reveal>
        <Reveal>
          <CtaBand
            contactContext={contactContext}
            subtitle={ctaBand.description}
            title={ctaBand.title}
          />
        </Reveal>
      </>
    )
  }

  const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)
  const services = getServicesForPage(page, servicesCatalog)

  return (
    <>
      <HeroSection contactContext={contactContext} content={hero} />
      {groups.map((group, index) => (
        <Reveal key={group.id}>
          <CatalogSplitSection
            group={group}
            image={remontiSplitImages[group.id].image}
            imageAlt={remontiSplitImages[group.id].imageAlt}
            mutedBackground={index % 2 === 1}
            number={`0${index + 1}`}
            reverse={index % 2 === 1}
            variant="group"
          />
        </Reveal>
      ))}
      <Reveal>
        <ServiceDetailsCatalog heading={detailsHeading} services={services} />
      </Reveal>
      <Reveal>
        <CtaBand
          contactContext={contactContext}
          subtitle={ctaBand.description}
          title={ctaBand.title}
        />
      </Reveal>
    </>
  )
}
