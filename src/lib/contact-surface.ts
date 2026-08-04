import type { ContactContext, ContactLine, ContactLineId } from '#/data/site-content'
import { siteContent } from '#/data/site-content'
import { buildPhoneHref, buildViberHref } from '#/lib/contact-hrefs'

export { buildPhoneHref, buildViberHref } from '#/lib/contact-hrefs'

export const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

const LINE_ORDER: ContactLineId[] = ['service', 'inspections', 'gas']

function findLineById(id: ContactLineId): ContactLine {
  const line = siteContent.contact.lines.find((entry) => entry.id === id)
  if (!line) {
    throw new Error(`Missing contact line: ${id}`)
  }
  return line
}

export function getDefaultContactLine(): ContactLine {
  return findLineById(siteContent.contact.defaultLineId)
}

export function resolveContactLine(context: ContactContext = 'default'): ContactLine {
  switch (context) {
    case 'gtp':
      return findLineById('inspections')
    case 'remonti':
      return findLineById('service')
    case 'gaz':
      return findLineById('gas')
    case 'default':
      return getDefaultContactLine()
    default: {
      const exhaustiveCheck: never = context
      return exhaustiveCheck
    }
  }
}

export function getAllContactLines(): readonly ContactLine[] {
  return LINE_ORDER.map((id) => findLineById(id))
}

export function contactPhoneLabel(line: ContactLine): string {
  return line.phoneDisplay
}

export function contactViberLabel(line: ContactLine, compact = false): string {
  return compact ? COMPACT_VIBER_LABEL : line.viberLabel
}
