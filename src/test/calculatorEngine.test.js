import { describe, expect, it } from 'vitest'
import {
  applyPercentage,
  calculate,
  formatNumber,
  OPERATORS,
} from '../logic/calculatorEngine.js'

describe('calculatorEngine', () => {
  it('performs all basic operations', () => {
    expect(calculate(12, 3, 'add')).toBe(15)
    expect(calculate(12, 3, 'subtract')).toBe(9)
    expect(calculate(12, 3, 'multiply')).toBe(36)
    expect(calculate(12, 3, 'divide')).toBe(4)
  })

  it('applies percentage and rejects division by zero', () => {
    expect(applyPercentage(50)).toBe(0.5)
    expect(() => calculate(12, 0, 'divide')).toThrow('Division by zero')
  })

  it('handles invalid operations and non-finite values', () => {
    expect(() => calculate(1, 2, 'invalid')).toThrow('valid mathematical operation')
    expect(() => calculate(Infinity, 1, 'add')).toThrow('outside the supported number range')
    expect(() => formatNumber(Infinity)).toThrow('non-finite')
  })

  it('exposes all operator labels', () => {
    expect(Object.keys(OPERATORS)).toEqual(['add', 'subtract', 'multiply', 'divide'])
  })
})
