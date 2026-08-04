import { Phone } from 'lucide-react'
import type { ContactContext, ContactLine } from '#/data/site-content'
import {
  COMPACT_VIBER_LABEL,
  contactPhoneLabel,
  contactViberLabel,
  resolveContactLine,
} from '#/lib/contact-surface'
import { cn } from '#/lib/utils'
import { ViberIcon } from '#/components/site/viber-icon'

type ContactChannelLinkProps = {
  channel: 'phone' | 'viber'
  context?: ContactContext
  variant: 'solid' | 'outline' | 'inverse-solid' | 'inverse-outline'
  className?: string
  onClick?: () => void
}

const variantClasses: Record<ContactChannelLinkProps['variant'], string> = {
  solid: 'bg-[#1e3a8a] text-white hover:bg-[#1e40af] hover:text-white',
  outline: 'border border-[#7360f2] text-[#7360f2] hover:bg-[#7360f2]/5',
  'inverse-solid': 'bg-white text-[#0a0a0a] hover:bg-neutral-100',
  'inverse-outline': 'border border-white text-white hover:bg-white/10',
}

export function ContactChannelLink({
  channel,
  context = 'default',
  variant,
  className,
  onClick,
}: ContactChannelLinkProps) {
  const line = resolveContactLine(context)
  const isPhone = channel === 'phone'
  const href = isPhone ? line.phoneHref : line.viberHref
  const label = isPhone ? contactPhoneLabel(line) : contactViberLabel(line, true)

  return (
    <a
      className={cn(
        'inline-flex items-center gap-2 px-5 py-3 text-sm font-bold motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 rounded-none',
        variantClasses[variant],
        className,
      )}
      href={href}
      onClick={onClick}
    >
      {isPhone ? <Phone aria-hidden className="size-4" /> : <ViberIcon className="size-4" />}
      {label}
    </a>
  )
}

type ContactLineLinkProps = {
  line: ContactLine
  channel: 'phone' | 'viber'
  compactViber?: boolean
  className?: string
  iconClassName?: string
  'aria-label'?: string
}

export function ContactLineLink({
  line,
  channel,
  compactViber = false,
  className,
  iconClassName,
  'aria-label': ariaLabel,
}: ContactLineLinkProps) {
  const isPhone = channel === 'phone'
  const href = isPhone ? line.phoneHref : line.viberHref
  const label = isPhone ? contactPhoneLabel(line) : contactViberLabel(line, compactViber)

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={href}
    >
      {isPhone ? (
        <Phone aria-hidden className={iconClassName} />
      ) : (
        <ViberIcon className={iconClassName} />
      )}
      {label}
    </a>
  )
}

export { COMPACT_VIBER_LABEL }
