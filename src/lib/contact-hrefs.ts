export function buildPhoneHref(e164: string): string {
  return `tel:${e164}`
}

export function buildViberHref(e164: string): string {
  const digits = e164.replace(/\D/g, '')
  return `viber://chat?number=${digits}`
}
