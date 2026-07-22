import { expect, test } from '@playwright/test'

const sitePaths = ['/', '/gtp', '/remonti', '/kontakti'] as const

test('homepage exposes the main call CTA and the site navigation', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('site-nav')).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Обадете се|0876 689 736/ }).first(),
  ).toHaveAttribute('href', /tel:\+359876689736/)
})

test('gtp page uses inspections phone number', async ({ page }) => {
  await page.goto('/gtp')
  await expect(page.getByRole('link', { name: 'Обадете се' })).toHaveAttribute(
    'href',
    'tel:+359876105674',
  )
  await expect(page.getByRole('link', { name: '0876 105 674' }).first()).toHaveAttribute(
    'href',
    'tel:+359876105674',
  )
})

test('contact page shows three phone links', async ({ page }) => {
  await page.goto('/kontakti')
  await expect(page.getByRole('link', { name: 'Сервиз: 0876 689 736' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Прегледи (ГТП): 0876 105 674' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Газови системи: 0887 816 055' }),
  ).toBeVisible()
  await expect(page.getByText(/Понеделник - Петък/).first()).toBeVisible()
  await expect(page.getByTestId('contact-map')).toBeVisible()
})

test('every page exposes tel and viber contact links', async ({ page }) => {
  for (const path of sitePaths) {
    await page.goto(path)

    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible()
    await expect(page.locator('a[href^="viber://"]').first()).toBeVisible()
  }
})

test('404 page links back to home', async ({ page }) => {
  await page.goto('/does-not-exist')

  await expect(page.getByRole('heading', { name: 'Страницата не е намерена' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Към началото' })).toHaveAttribute('href', '/')
})

test('gtp nav link is active on gtp page', async ({ page }) => {
  await page.goto('/gtp')

  const gtpLink = page.getByTestId('site-nav').getByRole('link', { name: 'ГТП' })
  await expect(gtpLink).toHaveAttribute('data-status', 'active')
})

test('home stats render lucide icons', async ({ page }) => {
  await page.goto('/')

  const statsStrip = page.getByTestId('stats-strip')
  await expect(statsStrip.locator('svg')).toHaveCount(3)
})
