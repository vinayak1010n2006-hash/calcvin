import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App.jsx'

function getResult(container) {
  return container.querySelector('.result-value')
}

async function enterCalculation(user, buttons) {
  for (const name of buttons) {
    await user.click(screen.getByRole('button', { name }))
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('CALCVIN calculator', () => {
  it.each([
    [['1', '2', '+', '3', '='], '15'],
    [['1', '2', '−', '3', '='], '9'],
    [['1', '2', '×', '3', '='], '36'],
    [['1', '2', '÷', '3', '='], '4'],
  ])('performs a basic calculation', async (buttons, expected) => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await enterCalculation(user, buttons)
    await waitFor(() => expect(getResult(container)).toHaveTextContent(expected))
  })

  it('calculates percentages and toggles sign', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await enterCalculation(user, ['5', '0', '%'])
    await waitFor(() => expect(getResult(container)).toHaveTextContent('0.5'))

    await user.click(screen.getByRole('button', { name: '±' }))
    await waitFor(() => expect(getResult(container)).toHaveTextContent('-0.5'))
  })

  it('supports decimal calculations', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await enterCalculation(user, ['0', '.', '1', '+', '0', '.', '2', '='])
    await waitFor(() => expect(getResult(container)).toHaveTextContent('0.3'))
  })

  it('supports backspace and clear', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await enterCalculation(user, ['1', '2', '3'])
    await user.click(screen.getByRole('button', { name: 'Backspace' }))
    await waitFor(() => expect(getResult(container)).toHaveTextContent('12'))

    await user.click(screen.getByRole('button', { name: 'AC' }))
    await waitFor(() => expect(getResult(container)).toHaveTextContent('0'))
  })

  it('shows division-by-zero as an error', async () => {
    const user = userEvent.setup()
    render(<App />)

    await enterCalculation(user, ['1', '÷', '0', '='])
    expect(screen.getByText('Division by zero is not defined.')).toBeInTheDocument()
  })

  it('responds to keyboard input', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.keyboard('12+3{Enter}')
    await waitFor(() => expect(getResult(container)).toHaveTextContent('15'))

    await user.keyboard('{Escape}')
    await waitFor(() => expect(getResult(container)).toHaveTextContent('0'))

    await user.keyboard('123{Backspace}')
    await waitFor(() => expect(getResult(container)).toHaveTextContent('12'))
  })

  it('persists history, reuses a result, and clears history', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await enterCalculation(user, ['2', '+', '3', '='])
    await user.click(screen.getByRole('button', { name: 'History' }))

    expect(container.querySelector('.history-expression')).toHaveTextContent('2 + 3')
    expect(container.querySelector('.history-result')).toHaveTextContent('= 5')

    const saved = JSON.parse(window.localStorage.getItem('calcvin-history'))
    expect(saved).toEqual([
      expect.objectContaining({ expression: '2 + 3', result: '5' }),
    ])

    await user.click(screen.getByTitle('Use result 5'))
    await user.click(screen.getByRole('button', { name: 'Clear all' }))

    expect(window.localStorage.getItem('calcvin-history')).toBe('[]')
  })

  it('switches between dark and light themes', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const shell = container.querySelector('.app-shell')

    expect(shell).not.toHaveClass('theme-light')
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(shell).toHaveClass('theme-light')
  })

  it('allows replaying a completed animation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await enterCalculation(user, ['4', '×', '2', '='])
    const replay = screen.getByRole('button', { name: 'Replay Multiplication animation' })

    await user.click(replay)
    expect(replay).toBeInTheDocument()
  })
})
