import { remontiGroups } from '#/data/services-catalog'
import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'
import { getSiteUrl } from '#/lib/site-url'

export type SitePath = '/' | '/gtp' | '/gaz' | '/remonti' | '/kontakti'

export type ServicePage = 'gtp' | 'gaz' | 'remonti'

export type Service = {
  id: string
  title: string
  summary: string
  details?: string
  page: ServicePage
  groupId?: string
}

export type ServiceGroupDef = {
  id: string
  title: string
  intro: string
  serviceIds: readonly string[]
}

export type NavigationItem = {
  to: SitePath
  label: string
}

export type ServiceCard = {
  title: string
  description: string
}

export type SeoEntry = {
  title: string
  description: string
}

export type ContactLineId = 'service' | 'inspections' | 'gas'

export type ContactContext = 'default' | 'gtp' | 'gaz' | 'remonti'

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

export type StatIcon = 'clipboard-check' | 'calendar-days' | 'fuel'

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

export const imageAlts = {
  shop: 'Автосервиз в Ловеч — работилница',
  gtp: 'Годишен технически преглед в автосервиз',
  repairs: 'Ремонт и поддръжка на автомобил в сервиз',
  gas: 'Монтаж и сервиз на газова уредба в автосервиз',
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
  title: 'ГТП, сервиз и газови системи в Ловеч',
  description:
    'Годишен преглед, ремонти и газови системи — на едно място в Ловеч. Обадете се и ще ви кажем кога да дойдете.',
  image: '/images/hero.jpg',
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
  {
    title: 'Газови системи',
    description:
      'Монтаж, ремонт и преглед на LPG/CNG газови уредби — намалете разходите за гориво и минете необходимите прегледи при нас.',
  },
] satisfies ServiceCard[]

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
  groups: remontiGroups,
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
        title: homeServiceCards[2].title,
        description: homeServiceCards[2].description,
        image: '/images/repairs-section.png',
        imageAlt: imageAlts.gas,
      },
    ] satisfies SplitSectionContent[],
    stats: [
      { value: 'ГТП', label: 'Годишен технически преглед', icon: 'clipboard-check' },
      { value: 'Пн–Пт', label: '9:00–18:00', icon: 'calendar-days' },
      { value: 'LPG/CNG', label: 'Монтаж и сервиз на газ', icon: 'fuel' },
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
        imageAlt: imageAlts.shop,
      },
    ] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
  gaz: {
    hero: {
      title: 'Газови системи',
      description:
        'Монтаж, ремонт и преглед на LPG/CNG газови уредби в Ловеч. Обадете се на линията за газови системи и ще ви насочим.',
      image: '/images/repairs-section.png',
      imageAlt: imageAlts.gas,
      primaryCtaLabel: 'Обадете се',
    },
    sections: [] satisfies SplitSectionContent[],
    ctaBand: {
      title: 'Обадете се за газови системи',
      description:
        'Монтаж, ремонт или преглед на LPG/CNG — направете едно обаждане на линията за газови системи.',
    },
  },
  remonti: {
    hero: {
      title: repairs.title,
      description: repairs.description,
      image: '/images/repairs-section.png',
      imageAlt: imageAlts.repairs,
      primaryCtaLabel: 'Обадете се',
    },
    sections: [] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
  kontakti: {
    hero: {
      title: contacts.title,
      description: contacts.description,
      image: '/images/hero.jpg',
      imageAlt: imageAlts.shop,
    },
    sections: [
      {
        title: 'Адрес и работно време',
        description: `${contact.address}. ${contact.hours.join('. ')}.`,
        image: '/images/trust-section.png',
        imageAlt: imageAlts.shop,
      },
    ] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
} satisfies Record<'home' | 'gtp' | 'gaz' | 'remonti' | 'kontakti', PageContent>

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
    { to: '/gaz', label: 'Газови системи' },
    { to: '/remonti', label: 'Ремонти' },
    { to: '/kontakti', label: 'Контакти' },
  ] satisfies NavigationItem[],
  contact,
  pages,
  home: {
    hero: homeHero,
    serviceCards: homeServiceCards,
  },
  gtp,
  repairs,
  contacts,
  seo: {
    home: {
      title: 'Начало',
      description:
        'ГТП, автосервиз и газови системи в Ловеч — Stefi Auto Gas. Запишете час по телефона.',
    },
    gtp: {
      title: 'ГТП',
      description: 'Годишен технически преглед в Ловеч — Stefi Auto Gas. Обадете се за час.',
    },
    gaz: {
      title: 'Газови системи',
      description:
        'Монтаж, ремонт и първоначален преглед на LPG/CNG газови уредби в Ловеч — Stefi Auto Gas.',
    },
    repairs: {
      title: 'Ремонти',
      description: 'Ремонти и поддръжка на автомобили в Ловеч — Stefi Auto Gas.',
    },
    contacts: {
      title: 'Контакти',
      description: 'Контакти, адрес и работно време на Stefi Auto Gas в Ловеч.',
    },
  } satisfies Record<'home' | 'gtp' | 'gaz' | 'repairs' | 'contacts', SeoEntry>,
} as const

export { servicesCatalog, remontiGroups } from '#/data/services-catalog'
