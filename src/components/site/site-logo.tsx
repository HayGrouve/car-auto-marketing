import { Link } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { cn } from '#/lib/utils'

type SiteLogoProps = {
  className?: string
  imageClassName?: string
  linkToHome?: boolean
  showWordmark?: boolean
  wordmarkClassName?: string
}

export function SiteLogo({
  className,
  imageClassName,
  linkToHome = true,
  showWordmark = true,
  wordmarkClassName,
}: SiteLogoProps) {
  const content = (
    <>
      <img
        alt=""
        aria-hidden
        className={cn('size-10 shrink-0', imageClassName)}
        height={40}
        src={siteContent.logoSrc}
        width={40}
      />
      {showWordmark ? (
        <span
          className={cn(
            'font-semibold uppercase tracking-wide text-neutral-900',
            wordmarkClassName,
          )}
        >
          {siteContent.brandName}
        </span>
      ) : null}
    </>
  )

  const wrapperClassName = cn('inline-flex items-center gap-3', className)

  if (linkToHome) {
    return (
      <Link className={wrapperClassName} to="/">
        {content}
      </Link>
    )
  }

  return <div className={wrapperClassName}>{content}</div>
}
