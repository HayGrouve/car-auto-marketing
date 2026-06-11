import type { ReactNode } from 'react'
import { siteContent } from '#/data/site-content'
import { ViberIcon } from '#/components/site/viber-icon'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

type ContactRowProps = {
  label: string
  children: ReactNode
}

function ContactRow({ label, children }: ContactRowProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[#525252]">{label}</p>
      {children}
    </div>
  )
}

export function ContactDetails() {
  const { phoneHref, phoneDisplay, viberHref, viberLabel, address, hours } = siteContent.contact

  return (
    <div className="space-y-8 text-[#0a0a0a]">
      <ContactRow label="Телефон">
        <a
          className="inline-flex items-center gap-2 text-lg font-bold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
          href={phoneHref}
        >
          <PhoneIcon className="size-5 shrink-0" />
          {phoneDisplay}
        </a>
      </ContactRow>

      <ContactRow label="Viber">
        <div className="space-y-1">
          <a
            className="inline-flex items-center gap-2 text-lg font-bold text-[#7360f2] underline-offset-4 hover:text-[#5a4fd1] hover:underline"
            href={viberHref}
          >
            <ViberIcon className="size-5 shrink-0" />
            {viberLabel}
          </a>
          <p className="text-sm text-[#525252]">Бързо съобщение</p>
        </div>
      </ContactRow>

      <ContactRow label="Адрес">
        <p className="max-w-prose text-base leading-7 text-[#525252]">{address}</p>
      </ContactRow>

      <ContactRow label="Работно време">
        <ul className="space-y-1 text-base leading-7 text-[#525252]">
          {hours.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </ContactRow>
    </div>
  )
}
