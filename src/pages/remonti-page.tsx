import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { SplitSection } from '#/components/site/split-section'
import { siteContent } from '#/data/site-content'

export function RemontiPage() {
  const { hero, sections, ctaBand } = siteContent.pages.remonti

  return (
    <>
      <HeroSection contactContext="remonti" content={hero} />
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
        <CtaBand contactContext="remonti" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
