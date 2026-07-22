import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'
import { getSiteUrl } from '#/lib/site-url'

export type SitePath = '/' | '/gtp' | '/remonti' | '/kontakti'

export type NavigationItem = {
  to: SitePath
  label: string
}

export type TrustPoint = {
  title: string
  description: string
}

export type ServiceCard = {
  title: string
  description: string
}

export type ServiceGroup = {
  title: string
  items: string[]
  description: string
}

export type SeoEntry = {
  title: string
  description: string
}

export type ContactLineId = 'service' | 'inspections' | 'gas'

export type ContactContext = 'default' | 'gtp' | 'remonti'

export type ContactLine = {
  id: ContactLineId
  label: string
  phoneE164: string
  phoneDisplay: string
  phoneHref: string
  viberHref: string
  viberLabel: string
}

export type ContactChannels = {
  lines: ContactLine[]
  defaultLineId: ContactLineId
  address: string
  hours: string[]
  schemaOpeningHours: string[]
  mapEmbedUrl: string
  mapsLink: string
}

export type PageCta = {
  title: string
  description: string
}

export type FooterContent = {
  tagline: string
  contactHeading: string
}

export type HeroContent = {
  eyebrow?: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  primaryCtaLabel?: string
}

export type SplitSectionContent = {
  title: string
  description: string
  image: string
  imageAlt: string
}

export type StatIcon = 'clipboard-check' | 'calendar-days' | 'map-pin'

export type StatItem = {
  value: string
  label: string
  icon: StatIcon
}

export type PageContent = {
  hero: HeroContent
  sections: SplitSectionContent[]
  stats?: StatItem[]
  ctaBand: PageCta
}

const imageAlts = {
  shop: 'Автосервиз в Ловеч — работилница',
  gtp: 'Годишен технически преглед в автосервиз',
  repairs: 'Ремонт и поддръжка на автомобил в сервиз',
  trust: 'Екип и обслужване в автосервиз Ловеч',
} as const


function buildContactLine(
  id: ContactLineId,
  label: string,
  phoneE164: string,
  phoneDisplay: string,
  viberLabel: string,
): ContactLine {
  return {
    id,
    label,
    phoneE164,
    phoneDisplay,
    phoneHref: buildPhoneHref(phoneE164),
    viberHref: buildViberHref(phoneE164),
    viberLabel,
  }
}

const contactLines = [
  buildContactLine(
    'service',
    'Сервиз',
    '+359876689736',
    '0876 689 736',
    'Viber — Сервиз',
  ),
  buildContactLine(
    'inspections',
    'Прегледи (ГТП)',
    '+359876105674',
    '0876 105 674',
    'Viber — Прегледи (ГТП)',
  ),
  buildContactLine(
    'gas',
    'Газови системи',
    '+359887816055',
    '0887 816 055',
    'Viber — Газови системи',
  ),
] satisfies ContactLine[]

const contact = {
  lines: contactLines,
  defaultLineId: 'service' as const,
  address: 'гр. Ловеч, бул. Освобождение 7',
  hours: ['Понеделник - Петък: 9:00 - 18:00'],
  schemaOpeningHours: ['Mo-Fr 09:00-18:00'],
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4816.500206376381!2d24.7225143!3d43.159890999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40abe75aa66b506f%3A0xc7f3c72f2bc99639!2sStefi%20Auto%20Gas!5e1!3m2!1sen!2sbg!4v1784727303042!5m2!1sen!2sbg',
  mapsLink: 'https://maps.app.goo.gl/PYfpkTAFxMp2xjw79?g_st=ic',
} satisfies ContactChannels

const homeHero = {
  eyebrow: 'Stefi Auto Gas',
  title: 'ГТП и автосервиз в Ловеч',
  description:
    'Годишен преглед, ремонти и обслужване — на едно място в Ловеч. Обадете се и ще ви кажем кога да дойдете.',
  image: '/images/lovech-service-shop.png',
  imageAlt: imageAlts.shop,
  primaryCtaLabel: 'Обадете се',
} satisfies HeroContent

const homeServiceCards = [
  {
    title: 'Годишен технически преглед',
    description:
      'Записвате се по телефона, минавате прегледа и си тръгвате с ясна информация — без излишно чакане.',
  },
  {
    title: 'Ремонти и поддръжка',
    description:
      'От диагностика до спирачки и ходова част — грижим се за колата ви, с която ходите всеки ден.',
  },
] satisfies ServiceCard[]

const homeTrustPoints = [
  {
    title: 'Грижа за колата ви',
    description:
      'Стремим се да върнем колата ви на пътя безопасно и в добро състояние.',
  },
  {
    title: 'Локален сервиз в Ловеч',
    description:
      'Намираме се в Ловеч — лесно ни намирате, а за записване стига едно обаждане.',
  },
  {
    title: 'Ясна комуникация',
    description:
      'Казваме ви какво правим и колко струва, преди да започнем работа.',
  },
] satisfies TrustPoint[]

const gtp = {
  title: 'Годишен технически преглед',
  description:
    'Трябва ви годишен технически преглед в Ловеч? Запишете час по телефона — ще ви кажем какво да очаквате.',
  steps: [
    'Обадете се и уточнете удобен час.',
    'Дойдете при нас в Ловеч.',
    'Минавате прегледа и си тръгвате с всичко необходимо.',
  ],
}

const repairs = {
  title: 'Ремонти и поддръжка',
  description:
    'Ремонтираме и поддържаме коли всеки ден — от диагностика до спирачки и ходова част. Обадете се и опишете проблема.',
  groups: [
    {
      title: 'Диагностика и обслужване',
      items: ['Компютърна диагностика', 'Смяна на масла', 'Смяна на филтри'],
      description:
        'Проверяваме какво не е наред, сменяме масла и филтри — редовната поддръжка, която пази колата ви в форма.',
    },
    {
      title: 'Спирачна система и ходова част',
      items: ['Накладки и дискове', 'Окачване', 'Проверка на ходова част'],
      description:
        'Спирачки, дискове и окачване — нещата, които ви трябват, за да сте спокойни на пътя.',
    },
    {
      title: 'Общи ремонти',
      items: ['Дребни ремонти', 'Поддръжка', 'Подготовка за път'],
      description:
        'Дребни ремонти, поддръжка и подготовка преди път — когато трябва нещо бързо оправено.',
    },
  ] satisfies ServiceGroup[],
}

const contacts = {
  title: 'Контакти',
  description:
    'Намерете ни в Ловеч, вижте кога сме отворени и се обадете с един клик.',
}

const sharedCtaBand = {
  title: 'Свържете се с нас за преглед или ремонт',
  description:
    'Най-лесно е да се обадите — ще ви запишем за преглед или ремонт и ще отговорим на въпросите ви.',
} satisfies PageCta

const pages = {
  home: {
    hero: homeHero,
    sections: [
      {
        title: homeServiceCards[0].title,
        description: homeServiceCards[0].description,
        image: '/images/gtp-section.png',
        imageAlt: imageAlts.gtp,
      },
      {
        title: homeServiceCards[1].title,
        description: homeServiceCards[1].description,
        image: '/images/repairs-section.png',
        imageAlt: imageAlts.repairs,
      },
      {
        title: 'Защо да изберете нас',
        description:
          'Познаваме Ловеч и работим честно — обясняваме какво правим и защо, преди да пипнем нещо.',
        image: '/images/trust-section.png',
        imageAlt: imageAlts.trust,
      },
    ] satisfies SplitSectionContent[],
    stats: [
      { value: 'ГТП', label: 'Годишен технически преглед', icon: 'clipboard-check' },
      { value: 'Пн–Пт', label: '9:00–18:00', icon: 'calendar-days' },
      { value: 'Ловеч', label: 'Автосервиз с бързо обслужване', icon: 'map-pin' },
    ] satisfies StatItem[],
    ctaBand: sharedCtaBand,
  },
  gtp: {
    hero: {
      title: gtp.title,
      description: gtp.description,
      image: '/images/gtp-section.png',
      imageAlt: imageAlts.gtp,
      primaryCtaLabel: 'Обадете се',
    },
    sections: [
      {
        title: 'Как протича прегледът',
        description:
          'Обаждате се, уточняваме удобен час, минавате прегледа при нас и си тръгвате с всичко необходимо.',
        image: '/images/gtp-section.png',
        imageAlt: imageAlts.gtp,
      },
      {
        title: 'Какво получавате',
        description:
          'Бързо записване, преглед на място и ясен отговор — без да обикаляте излишно.',
        image: '/images/trust-section.png',
        imageAlt: imageAlts.trust,
      },
    ] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
  remonti: {
    hero: {
      title: repairs.title,
      description: repairs.description,
      image: '/images/repairs-section.png',
      imageAlt: imageAlts.repairs,
      primaryCtaLabel: 'Обадете се',
    },
    sections: [
      {
        title: repairs.groups[0].title,
        description: repairs.groups[0].description,
        image: '/images/repairs-section.png',
        imageAlt: imageAlts.repairs,
      },
      {
        title: repairs.groups[1].title,
        description: `${repairs.groups[1].description} ${repairs.groups[2].description}`,
        image: '/images/trust-section.png',
        imageAlt: imageAlts.trust,
      },
    ] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
  kontakti: {
    hero: {
      title: contacts.title,
      description: contacts.description,
      image: '/images/lovech-service-shop.png',
      imageAlt: imageAlts.shop,
    },
    sections: [
      {
        title: 'Адрес и работно време',
        description: `${contact.address}. ${contact.hours.join('. ')}.`,
        image: '/images/trust-section.png',
        imageAlt: imageAlts.trust,
      },
    ] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
} satisfies Record<'home' | 'gtp' | 'remonti' | 'kontakti', PageContent>

export const siteContent = {
  locale: 'bg-BG',
  city: 'Ловеч',
  siteUrl: getSiteUrl(),
  brandName: 'Stefi Auto Gas',
  footer: {
    tagline: 'ГТП, сервиз и газови системи в Ловеч',
    contactHeading: 'Адрес',
  } satisfies FooterContent,
  navigation: [
    { to: '/', label: 'Начало' },
    { to: '/gtp', label: 'ГТП' },
    { to: '/remonti', label: 'Ремонти' },
    { to: '/kontakti', label: 'Контакти' },
  ] satisfies NavigationItem[],
  contact,
  pages,
  home: {
    hero: homeHero,
    serviceCards: homeServiceCards,
    trustPoints: homeTrustPoints,
  },
  gtp,
  repairs,
  contacts,
  seo: {
    home: {
      title: 'Начало',
      description: 'ГТП и автосервиз в Ловеч — Stefi Auto Gas. Запишете час по телефона.',
    },
    gtp: {
      title: 'ГТП',
      description: 'Годишен технически преглед в Ловеч — Stefi Auto Gas. Обадете се за час.',
    },
    repairs: {
      title: 'Ремонти',
      description: 'Ремонти и поддръжка на автомобили в Ловеч — Stefi Auto Gas.',
    },
    contacts: {
      title: 'Контакти',
      description: 'Контакти, адрес и работно време на Stefi Auto Gas в Ловеч.',
    },
  } satisfies Record<'home' | 'gtp' | 'repairs' | 'contacts', SeoEntry>,
} as const
