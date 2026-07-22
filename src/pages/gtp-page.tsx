import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { ServiceCatalog } from '#/components/site/service-catalog'
import { SplitSection } from '#/components/site/split-section'
import { servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getServicesForPage } from '#/lib/services'

export function GtpPage() {
  const { hero, sections, ctaBand } = siteContent.pages.gtp
  const gtpServices = getServicesForPage('gtp', servicesCatalog)

  return (
    <>
      <HeroSection contactContext="gtp" content={hero} />
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
        <ServiceCatalog
          heading="Годишен технически преглед — подробности"
          services={gtpServices}
          variant="flat"
        />
      </Reveal>
      <Reveal>
        <CtaBand contactContext="gtp" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
