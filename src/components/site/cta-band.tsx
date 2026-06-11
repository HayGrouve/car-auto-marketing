import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { cn } from '#/lib/utils'

type CtaBandProps = {
  title: string
  subtitle?: string
  tone?: 'dark' | 'accent'
}

const toneClasses = {
  dark: {
    section: 'bg-[#0a0a0a]',
    subtitle: 'text-neutral-300',
  },
  accent: {
    section: 'bg-[#1e3a8a]',
    subtitle: 'text-blue-100',
  },
} as const

export function CtaBand({ title, subtitle, tone = 'dark' }: CtaBandProps) {
  const styles = toneClasses[tone]

  return (
    <section className={cn(styles.section, 'px-6 py-11 lg:px-10')}>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">{title}</h2>
          {subtitle ? (
            <p className={cn('max-w-2xl text-sm leading-6', styles.subtitle)}>{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <ContactChannelLink channel="phone" variant="inverse-solid" />
          <ContactChannelLink channel="viber" variant="inverse-outline" />
        </div>
      </div>
    </section>
  )
}
