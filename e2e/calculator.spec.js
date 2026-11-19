import { test, expect } from '@playwright/test'

async function clickLabels(page, labels) {
  for (const label of labels) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
}

async function expectResult(page, value) {
  await expect(page.locator('.result-value')).toHaveText(value)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('loads successfully and supports basic operations', async ({ page }) => {
  await expect(page).toHaveTitle(/CALCVIN/i)
  await expect(page.getByRole('button', { name: 'History', exact: true })).toBeVisible()

  await clickLabels(page, ['1', '2', '+', '3', '='])
  await expectResult(page, '15')

  await clickLabels(page, ['AC', '1', '2', '−', '3', '='])
  await expectResult(page, '9')

  await clickLabels(page, ['AC', '1', '2', '×', '3', '='])
  await expectResult(page, '36')

  await clickLabels(page, ['AC', '1', '2', '÷', '3', '='])
  await expectResult(page, '4')
})

test('supports percentage, sign, clear, and backspace', async ({ page }) => {
  await clickLabels(page, ['5', '0', '%'])
  await expectResult(page, '0.5')

  await page.getByRole('button', { name: '±', exact: true }).click()
  await expectResult(page, '-0.5')

  await clickLabels(page, ['AC', '1', '2', '3', 'Backspace'])
  await expectResult(page, '12')

  await page.getByRole('button', { name: 'AC', exact: true }).click()
  await expectResult(page, '0')
})

test('supports keyboard input and division by zero', async ({ page }) => {
  await page.keyboard.type('12+3')
  await page.keyboard.press('Enter')
  await expectResult(page, '15')

  await page.keyboard.press('Escape')
  await page.keyboard.press('1')
  await page.keyboard.press('/')
  await page.keyboard.press('0')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Division by zero is not defined.')).toBeVisible()
})

test('opens history, persists it across reload, and reuses results', async ({ page }) => {
  await clickLabels(page, ['2', '+', '3', '='])
  await page.getByRole('button', { name: 'History', exact: true }).click()

  await expect(page.locator('.history-expression')).toHaveText('2 + 3')
  await expect(page.locator('.history-result')).toContainText('5')

  await page.reload()
  await page.getByRole('button', { name: 'History', exact: true }).click()
  await expect(page.locator('.history-expression')).toHaveText('2 + 3')

  await page.getByTitle('Use result 5').click()
  await expectResult(page, '5')
})

test('switches theme and replays the completed animation', async ({ page }) => {
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(page.locator('.app-shell')).toHaveClass(/theme-light/)

  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('.app-shell')).not.toHaveClass(/theme-light/)

  await clickLabels(page, ['4', '×', '2', '='])
  const replay = page.getByRole('button', { name: 'Replay Multiplication animation' })
  await expect(replay).toBeVisible()
  await replay.click()
  await expect(replay).toBeVisible()
})

test('has no browser errors during normal usage', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.reload()
  await clickLabels(page, ['8', '+', '2', '='])
  await page.getByRole('button', { name: 'History', exact: true }).click()
  await page.getByRole('button', { name: 'Switch to light theme' }).click()

  expect(errors).toEqual([])
})
