import { Link } from '@tanstack/react-router'
import type { SplitSectionContent } from '#/data/site-content'
import { cn } from '#/lib/utils'

type SectionLink = {
  label: string
  href: string
}

type SplitSectionProps = {
  content: SplitSectionContent
  reverse?: boolean
  mutedBackground?: boolean
  number?: string
  link?: SectionLink
}

function SectionLinkAnchor({ link }: { link: SectionLink }) {
  const className =
    'inline-block border-b-2 border-[#1e3a8a] pb-0.5 text-sm font-bold text-[#1e3a8a] hover:text-[#1e40af] rounded-none'

  if (link.href.startsWith('/')) {
    return (
      <Link className={className} to={link.href}>
        {link.label}
      </Link>
    )
  }

  return (
    <a className={className} href={link.href}>
      {link.label}
    </a>
  )
}

export function SplitSection({
  content,
  reverse = false,
  mutedBackground = false,
  number,
  link,
}: SplitSectionProps) {
  return (
    <section className={cn(mutedBackground && 'bg-[#fafafa]')}>
      <div
        className={cn(
          'grid md:grid-cols-2',
          reverse && '[&>*:first-child]:md:order-2 [&>*:last-child]:md:order-1',
        )}
      >
        <div className="flex flex-col justify-center px-6 py-12 lg:px-10 lg:py-16">
          {number ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#1e3a8a]">
              {number}
            </p>
          ) : null}
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-prose text-base leading-7 text-[#525252]">{content.description}</p>
          {link ? (
            <div className="mt-6">
              <SectionLinkAnchor link={link} />
            </div>
          ) : null}
        </div>
        <div className="aspect-[4/3] min-h-[280px] overflow-hidden md:aspect-auto md:min-h-[280px]">
          <img
            alt={content.imageAlt}
            className="h-full min-h-[280px] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:scale-[1.03]"
            decoding="async"
            loading="lazy"
            src={content.image}
          />
        </div>
      </div>
    </section>
  )
}
