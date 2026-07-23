import { CtaBand } from '#/components/site/cta-band'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { ServiceCatalog } from '#/components/site/service-catalog'
import { gazSplitImages } from '#/data/catalog-split-images'
import { servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getServicesForPage } from '#/lib/services'

export function GazPage() {
  const { hero, ctaBand } = siteContent.pages.gaz
  const services = getServicesForPage('gaz', servicesCatalog)

  return (
    <>
      <HeroSection contactContext="gas" content={hero} />
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
        <ServiceCatalog
          heading="Газови услуги — подробности"
          services={services}
          variant="flat"
        />
      </Reveal>
      <Reveal>
        <CtaBand contactContext="gas" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
