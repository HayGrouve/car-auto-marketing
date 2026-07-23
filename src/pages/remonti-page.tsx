import { CtaBand } from '#/components/site/cta-band'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { remontiSplitImages } from '#/data/catalog-split-images'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getRemontiGroupsWithServices } from '#/lib/services'

export function RemontiPage() {
  const { hero, ctaBand } = siteContent.pages.remonti
  const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)

  return (
    <>
      <HeroSection contactContext="remonti" content={hero} />
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
        <CtaBand contactContext="remonti" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
