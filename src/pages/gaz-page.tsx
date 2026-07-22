import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { ServiceCatalog } from '#/components/site/service-catalog'
import { servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getServicesForPage } from '#/lib/services'

export function GazPage() {
  const { hero, ctaBand } = siteContent.pages.gaz
  const services = getServicesForPage('gaz', servicesCatalog)

  return (
    <>
      <HeroSection contactContext="gas" content={hero} />
      <Reveal>
        <ServiceCatalog heading="Газови услуги" services={services} variant="flat" />
      </Reveal>
      <Reveal>
        <CtaBand contactContext="gas" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
