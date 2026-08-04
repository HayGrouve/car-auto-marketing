import { CtaBand } from '#/components/site/cta-band'
import { ContactDetails } from '#/components/site/contact-details'
import { HeroSection } from '#/components/site/hero-section'
import { MapEmbed } from '#/components/site/map-embed'
import { Reveal } from '#/components/site/reveal'
import { SplitLayout } from '#/components/site/split-layout'
import { getPageEntry } from '#/data/site-content'

export function KontaktiPage() {
  const { content } = getPageEntry('/kontakti')
  const { hero, sections, ctaBand } = content
  const section = sections[0]

  return (
    <>
      <HeroSection content={hero} />
      <Reveal>
        <SplitLayout
          content={
            <>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
                {section.title}
              </h2>
              <div className="mt-6">
                <ContactDetails />
              </div>
            </>
          }
          media={<MapEmbed />}
          mutedBackground
        />
      </Reveal>
      <Reveal>
        <CtaBand subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
