import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

for (const viewport of viewports) {
  test(`${viewport.name} layout at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()

    await expect(page.locator('.calculator-card')).toBeVisible()
    await expect(page.locator('.stage-panel')).toBeVisible()

    const layout = await page.evaluate(() => {
      const keys = [...document.querySelectorAll('.key')]
      const clippedKeys = keys
        .map((key) => {
          const rect = key.getBoundingClientRect()
          return {
            label: key.getAttribute('aria-label'),
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
          }
        })
        .filter((rect) => rect.left < 0 || rect.right > window.innerWidth || rect.top < 0)

      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        clippedKeys,
      }
    })

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.clippedKeys).toEqual([])

    await page.screenshot({
      path: `test-results/screenshots/${viewport.name}-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })
  })
}
