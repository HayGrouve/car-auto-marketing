import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { ServiceCatalog } from '#/components/site/service-catalog'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getRemontiGroupsWithServices } from '#/lib/services'

export function RemontiPage() {
  const { hero, ctaBand } = siteContent.pages.remonti
  const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)

  return (
    <>
      <HeroSection contactContext="remonti" content={hero} />
      <Reveal>
        <ServiceCatalog groups={groups} variant="grouped" />
      </Reveal>
      <Reveal>
        <CtaBand contactContext="remonti" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
