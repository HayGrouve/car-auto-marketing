import { Phone } from 'lucide-react'
import type { ContactContext } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-context'
import { cn } from '#/lib/utils'
import { ViberIcon } from '#/components/site/viber-icon'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

type Props = {
  channel: 'phone' | 'viber'
  context?: ContactContext
  variant: 'solid' | 'outline' | 'inverse-solid' | 'inverse-outline'
  className?: string
  onClick?: () => void
}

const variantClasses: Record<Props['variant'], string> = {
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
}: Props) {
  const line = resolveContactLine(context)
  const isPhone = channel === 'phone'
  const href = isPhone ? line.phoneHref : line.viberHref
  const label = isPhone ? line.phoneDisplay : COMPACT_VIBER_LABEL

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
