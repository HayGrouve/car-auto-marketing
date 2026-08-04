import { Link } from '@tanstack/react-router'
import { SplitLayout } from '#/components/site/split-layout'
import type { SplitSectionContent } from '#/data/site-content'

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
    <SplitLayout
      content={
        <>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-prose text-base leading-7 text-[#525252]">{content.description}</p>
          {link ? (
            <div className="mt-6">
              <SectionLinkAnchor link={link} />
            </div>
          ) : null}
        </>
      }
      image={content.image}
      imageAlt={content.imageAlt}
      mutedBackground={mutedBackground}
      number={number}
      reverse={reverse}
    />
  )
}
