import { CalendarDays, ClipboardCheck, MapPin } from 'lucide-react'
import type { StatIcon } from '#/data/site-content'
import { cn } from '#/lib/utils'

const iconMap = {
  'clipboard-check': ClipboardCheck,
  'calendar-days': CalendarDays,
  'map-pin': MapPin,
} as const

type StatIconProps = {
  icon: StatIcon
  className?: string
}

export function StatIconGlyph({ icon, className }: StatIconProps) {
  const Icon = iconMap[icon]
  return <Icon aria-hidden className={cn('size-6 text-[#1e3a8a]', className)} />
}
