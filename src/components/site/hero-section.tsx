import { Link } from '@tanstack/react-router'
import type { HeroContent } from '#/data/site-content'
import { siteContent } from '#/data/site-content'

type Cta = {
  label: string
  href: string
}

type HeroSectionProps = {
  content: HeroContent
  secondaryCta?: Cta
}

const primaryCtaClassName =
  'inline-flex items-center justify-center bg-[#1e3a8a] px-5 py-3 text-sm font-bold text-white hover:bg-[#1e40af] hover:text-white motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 rounded-none'

const secondaryCtaClassName =
  'inline-flex items-center justify-center border border-[#1e3a8a] px-5 py-3 text-sm font-bold text-[#1e3a8a] hover:bg-[#1e3a8a]/5 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 rounded-none'

function HeroCta({ cta, className }: { cta: Cta; className: string }) {
  if (cta.href.startsWith('/')) {
    return (
      <Link className={className} to={cta.href}>
        {cta.label}
      </Link>
    )
  }

  return (
    <a className={className} href={cta.href}>
      {cta.label}
    </a>
  )
}

export function HeroSection({ content, secondaryCta }: HeroSectionProps) {
  const primaryCta: Cta | null = content.primaryCtaLabel
    ? { label: content.primaryCtaLabel, href: siteContent.contact.phoneHref }
    : null

  return (
    <section className="relative min-h-[340px] w-full overflow-hidden md:min-h-[420px]">
      {content.image ? (
        <img
          alt={content.imageAlt ?? ''}
          className="hero-image-scale-in absolute inset-0 h-full w-full object-cover"
          src={content.image}
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20"
      />
      <div className="relative flex min-h-[340px] items-center px-6 py-12 md:min-h-[420px] lg:px-10">
        <div className="max-w-xl space-y-5">
          {content.eyebrow ? (
            <p className="rise-in inline-block border border-[#1e3a8a] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#1e3a8a] rounded-none">
              {content.eyebrow}
            </p>
          ) : null}
          <h1 className="rise-in text-4xl font-extrabold tracking-tight text-[#0a0a0a] md:text-5xl">
            {content.title}
          </h1>
          <p className="rise-in rise-in-delay-120 text-base leading-7 text-[#525252] md:text-lg">
            {content.description}
          </p>
          {primaryCta || secondaryCta ? (
            <div className="rise-in rise-in-delay-240 flex flex-wrap gap-3 pt-1">
              {primaryCta ? <HeroCta className={primaryCtaClassName} cta={primaryCta} /> : null}
              {secondaryCta ? (
                <HeroCta className={secondaryCtaClassName} cta={secondaryCta} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
