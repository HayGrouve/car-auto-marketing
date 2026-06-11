import { expect, test } from '@playwright/test'

const sitePaths = ['/', '/gtp', '/remonti', '/kontakti'] as const

test('homepage exposes the main call CTA and the site navigation', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('site-nav')).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Обадете се|0888 000 000/ }).first(),
  ).toHaveAttribute('href', /tel:/)
})

test('contact page exposes the map container and working hours', async ({ page }) => {
  await page.goto('/kontakti')

  await expect(page.getByText(/Понеделник - Петък/)).toBeVisible()
  await expect(page.getByTestId('contact-map')).toBeVisible()
})

test('every page exposes tel and viber contact links', async ({ page }) => {
  for (const path of sitePaths) {
    await page.goto(path)

    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible()
    await expect(page.locator('a[href^="viber://"]').first()).toBeVisible()
  }
})
