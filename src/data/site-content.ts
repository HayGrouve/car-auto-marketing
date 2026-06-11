import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'

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

export type ContactChannels = {
  phoneE164: string
  phoneDisplay: string
  phoneHref: string
  viberHref: string
  viberLabel: string
  address: string
  hours: string[]
  mapEmbedUrl: string
}

export type PageCta = {
  title: string
  description: string
}

export type HeroContent = {
  eyebrow?: string
  title: string
  description: string
  image?: string
  primaryCtaLabel?: string
}

export type SplitSectionContent = {
  title: string
  description: string
  image: string
}

export type StatItem = {
  value: string
  label: string
}

export type PageContent = {
  hero: HeroContent
  sections: SplitSectionContent[]
  stats?: StatItem[]
  ctaBand: PageCta
}

const phoneE164 = '+359888000000'

const contact = {
  phoneE164,
  phoneDisplay: '0888 000 000',
  phoneHref: buildPhoneHref(phoneE164),
  viberHref: buildViberHref(phoneE164),
  viberLabel: 'Пишете ни във Viber',
  address: 'гр. Ловеч, ул. Примерна 12',
  hours: [
    'Понеделник - Петък: 08:30 - 18:00',
    'Събота: 09:00 - 13:00',
  ],
  mapEmbedUrl: 'https://www.google.com/maps?q=Ловеч&output=embed',
} satisfies ContactChannels

const homeHero = {
  eyebrow: 'гр. Ловеч',
  title: 'ГТП и автосервиз в Ловеч',
  description:
    'Годишен преглед, ремонти и обслужване — на едно място в Ловеч. Обадете се и ще ви кажем кога да дойдете.',
  image: '/images/lovech-service-shop.png',
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
  ctaTitle: 'Запишете час за технически преглед',
  ctaDescription:
    'Най-лесно е да се обадите — ще ви запишем и ще отговорим на въпросите ви.',
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
  ctaTitle: 'Обадете се за ремонт и консултация',
  ctaDescription:
    'Обадете се, разкажете какво ви притеснява — ще ви кажем как можем да помогнем.',
}

const contacts = {
  title: 'Контакти',
  description:
    'Намерете ни в Ловеч, вижте кога сме отворени и се обадете с един клик.',
  ctaTitle: 'Свържете се директно по телефона',
  ctaDescription:
    'Ако картата не се зареди — адресът и телефонът са тук. Обадете се, ще ви насочим.',
}

const pages = {
  home: {
    hero: homeHero,
    sections: [
      {
        title: homeServiceCards[0].title,
        description: homeServiceCards[0].description,
        image: '/images/gtp-section.png',
      },
      {
        title: homeServiceCards[1].title,
        description: homeServiceCards[1].description,
        image: '/images/repairs-section.png',
      },
      {
        title: 'Защо да изберете нас',
        description:
          'Познаваме Ловеч и работим честно — обясняваме какво правим и защо, преди да пипнем нещо.',
        image: '/images/trust-section.png',
      },
    ] satisfies SplitSectionContent[],
    stats: [
      { value: 'ГТП', label: 'Годишен технически преглед' },
      { value: 'Пн–Сб', label: 'Работим, когато ви трябваме' },
      { value: 'Ловеч', label: 'Автосервиз с бързо обслужване' },
    ] satisfies StatItem[],
    ctaBand: {
      title: 'Свържете се с нас за преглед или ремонт',
      description:
        'Най-лесно е да се обадите — ще ви запишем за преглед или ремонт и ще отговорим на въпросите ви.',
    },
  },
  gtp: {
    hero: {
      title: gtp.title,
      description: gtp.description,
      image: '/images/gtp-section.png',
    },
    sections: [
      {
        title: 'Как протича прегледът',
        description:
          'Обаждате се, уточняваме удобен час, минавате прегледа при нас и си тръгвате с всичко необходимо.',
        image: '/images/gtp-section.png',
      },
      {
        title: 'Какво получавате',
        description:
          'Бързо записване, преглед на място и ясен отговор — без да обикаляте излишно.',
        image: '/images/trust-section.png',
      },
    ] satisfies SplitSectionContent[],
    ctaBand: {
      title: gtp.ctaTitle,
      description: gtp.ctaDescription,
    },
  },
  remonti: {
    hero: {
      title: repairs.title,
      description: repairs.description,
      image: '/images/repairs-section.png',
    },
    sections: [
      {
        title: repairs.groups[0].title,
        description: repairs.groups[0].description,
        image: '/images/repairs-section.png',
      },
      {
        title: repairs.groups[1].title,
        description: `${repairs.groups[1].description} ${repairs.groups[2].description}`,
        image: '/images/trust-section.png',
      },
    ] satisfies SplitSectionContent[],
    ctaBand: {
      title: repairs.ctaTitle,
      description: repairs.ctaDescription,
    },
  },
  kontakti: {
    hero: {
      title: contacts.title,
      description: contacts.description,
      image: '/images/lovech-service-shop.png',
    },
    sections: [
      {
        title: 'Адрес и работно време',
        description: `${contact.address}. ${contact.hours.join('. ')}.`,
        image: '/images/trust-section.png',
      },
    ] satisfies SplitSectionContent[],
    ctaBand: {
      title: contacts.ctaTitle,
      description: contacts.ctaDescription,
    },
  },
} satisfies Record<'home' | 'gtp' | 'remonti' | 'kontakti', PageContent>

export const siteContent = {
  locale: 'bg-BG',
  city: 'Ловеч',
  siteUrl: 'https://avtoserviz-lovech.bg',
  brandName: 'Автосервиз Ловеч',
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
      description: 'ГТП и автосервиз в Ловеч — запишете час по телефона.',
    },
    gtp: {
      title: 'ГТП',
      description: 'Годишен технически преглед в Ловеч. Обадете се за час.',
    },
    repairs: {
      title: 'Ремонти',
      description: 'Ремонти и поддръжка на автомобили в Ловеч.',
    },
    contacts: {
      title: 'Контакти',
      description: 'Контакти, адрес и работно време на автосервиза в Ловеч.',
    },
  } satisfies Record<'home' | 'gtp' | 'repairs' | 'contacts', SeoEntry>,
} as const
