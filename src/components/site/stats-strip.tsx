import type { StatItem } from '#/data/site-content'
import { cn } from '#/lib/utils'

type StatsStripProps = {
  stats: StatItem[]
}

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <div className="border-y border-[#e5e5e5] bg-white">
      <div className="flex flex-col md:flex-row">
        {stats.map((stat, index) => (
          <div
            className={cn(
              'flex flex-1 flex-col items-start gap-1 px-6 py-8 lg:px-10',
              index > 0 && 'border-t border-[#e5e5e5] md:border-t-0 md:border-l',
            )}
            key={`${stat.value}-${stat.label}`}
          >
            <p className="text-3xl font-extrabold tracking-tight text-[#1e3a8a] md:text-4xl">
              {stat.value}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#525252]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
