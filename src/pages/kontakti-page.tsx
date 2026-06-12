import { CtaBand } from '#/components/site/cta-band'
import { ContactDetails } from '#/components/site/contact-details'
import { HeroSection } from '#/components/site/hero-section'
import { MapEmbed } from '#/components/site/map-embed'
import { Reveal } from '#/components/site/reveal'
import { siteContent } from '#/data/site-content'

export function KontaktiPage() {
  const { hero, ctaBand } = siteContent.pages.kontakti

  return (
    <>
      <HeroSection content={hero} />
      <Reveal>
        <section className="bg-[#fafafa]">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-12 lg:px-10 lg:py-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
                Адрес и работно време
              </h2>
              <div className="mt-6">
                <ContactDetails />
              </div>
            </div>
            <div className="min-h-[280px] px-6 py-12 lg:px-10 lg:py-16">
              <MapEmbed />
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <CtaBand subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
