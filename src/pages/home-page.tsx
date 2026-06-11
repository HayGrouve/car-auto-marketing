import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { SplitSection } from '#/components/site/split-section'
import { StatsStrip } from '#/components/site/stats-strip'
import { siteContent } from '#/data/site-content'

export function HomePage() {
  const { hero, stats, sections, ctaBand } = siteContent.pages.home

  return (
    <>
      <HeroSection content={hero} />
      <StatsStrip stats={stats} />
      {sections.map((section, index) => (
        <SplitSection
          content={section}
          key={section.title}
          mutedBackground={index % 2 === 1}
          number={`0${index + 1}`}
          reverse={index % 2 === 1}
        />
      ))}
      <CtaBand subtitle={ctaBand.description} title={ctaBand.title} tone="accent" />
    </>
  )
}
