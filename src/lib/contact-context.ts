import type { ContactContext, ContactLine, ContactLineId } from '#/data/site-content'
import { siteContent } from '#/data/site-content'

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
    case 'gas':
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
