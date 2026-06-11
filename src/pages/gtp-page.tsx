import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { SplitSection } from '#/components/site/split-section'
import { siteContent } from '#/data/site-content'

export function GtpPage() {
  const { hero, sections, ctaBand } = siteContent.pages.gtp

  return (
    <>
      <HeroSection content={hero} />
      {sections.map((section, index) => (
        <SplitSection
          content={section}
          key={section.title}
          mutedBackground={index % 2 === 1}
          number={`0${index + 1}`}
          reverse={index % 2 === 1}
        />
      ))}
      <CtaBand subtitle={ctaBand.description} title={ctaBand.title} />
    </>
  )
}
