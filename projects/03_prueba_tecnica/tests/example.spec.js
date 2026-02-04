import { test, expect } from '@playwright/test'

const LOCALHOST_URL = 'http://localhost:5173/'

test.describe('Cat App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOCALHOST_URL)
  })

  test('should display a cat fact and image on load', async ({ page }) => {
    const fact = page.locator('p')
    const image = page.locator('img')
    const imageSrc = await image.getAttribute('src')

    await expect(fact).not.toBeEmpty()
    await expect(imageSrc).toContain('https://cataas.com/cat/')
    await expect(image).toBeVisible()
  })

  test('should fetch a new cat fact and image on button click', async ({ page }) => {
    const fact = page.locator('p')
    const image = page.locator('img')
    const imageSrc = await image.getAttribute('src')
    const button = page.getByRole('button', { name: 'New Fact' })

    const initialFact = await fact.textContent()
    const initialImageSrc = await image.getAttribute('src')

    await button.click()

    await expect(fact).not.toHaveText(initialFact)
    await expect(imageSrc).toContain('https://cataas.com/cat/')
    await expect(image).not.toHaveAttribute('src', initialImageSrc)
  })
})
