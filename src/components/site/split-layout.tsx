import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

type SplitLayoutImageProps = {
  image: string
  imageAlt: string
  media?: never
}

type SplitLayoutMediaProps = {
  media: ReactNode
  image?: never
  imageAlt?: never
}

export type SplitLayoutProps = {
  reverse?: boolean
  mutedBackground?: boolean
  number?: string
  ariaLabelledBy?: string
  content: ReactNode
} & (SplitLayoutImageProps | SplitLayoutMediaProps)

export function SplitLayout({
  reverse = false,
  mutedBackground = false,
  number,
  ariaLabelledBy,
  content,
  ...mediaProps
}: SplitLayoutProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={cn(mutedBackground && 'bg-[#fafafa]')}
    >
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
          {content}
        </div>
        {'media' in mediaProps && mediaProps.media ? (
          <div className="min-h-[280px] px-6 py-12 lg:px-10 lg:py-16">{mediaProps.media}</div>
        ) : (
          <div className="aspect-[4/3] min-h-[280px] overflow-hidden md:aspect-auto md:min-h-[280px]">
            <img
              alt={mediaProps.imageAlt}
              className="h-full min-h-[280px] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:scale-[1.03]"
              decoding="async"
              loading="lazy"
              src={mediaProps.image}
            />
          </div>
        )}
      </div>
    </section>
  )
}
