import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { SplitSection } from '#/components/site/split-section'
import { StatsStrip } from '#/components/site/stats-strip'
import { siteContent } from '#/data/site-content'

const homeSectionLinks = [
  { label: 'Повече за ГТП', href: '/gtp' },
  { label: 'Повече за ремонти', href: '/remonti' },
  { label: 'Повече за газ', href: '/gaz' },
] as const

export function HomePage() {
  const { hero, stats, sections, ctaBand } = siteContent.pages.home

  return (
    <>
      <HeroSection content={hero} />
      <StatsStrip stats={stats} />
      {sections.map((section, index) => (
        <Reveal key={section.title}>
          <SplitSection
            content={section}
            link={homeSectionLinks[index]}
            mutedBackground={index % 2 === 1}
            number={`0${index + 1}`}
            reverse={index % 2 === 1}
          />
        </Reveal>
      ))}
      <Reveal>
        <CtaBand subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
