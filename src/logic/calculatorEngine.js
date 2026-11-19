export const OPERATORS = {
  add: { symbol: '+', name: 'Addition', displayName: 'ADD' },
  subtract: { symbol: '−', name: 'Subtraction', displayName: 'SUBTRACT' },
  multiply: { symbol: '×', name: 'Multiplication', displayName: 'MULTIPLY' },
  divide: { symbol: '÷', name: 'Division', displayName: 'DIVIDE' },
}

export function calculate(left, right, operator) {
  let result

  switch (operator) {
    case 'add':
      result = left + right
      break
    case 'subtract':
      result = left - right
      break
    case 'multiply':
      result = left * right
      break
    case 'divide':
      if (right === 0) {
        throw new Error('Division by zero is not defined.')
      }
      result = left / right
      break
    default:
      throw new Error('Select a valid mathematical operation.')
  }

  if (!Number.isFinite(result)) {
    throw new Error('This result is outside the supported number range.')
  }

  return Object.is(result, -0) ? 0 : Number(result.toPrecision(12))
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) {
    throw new Error('Cannot display a non-finite result.')
  }
  return String(Object.is(value, -0) ? 0 : value)
}

export function formatExpressionNumber(value) {
  return formatNumber(value)
}

export function applyPercentage(value) {
  return calculate(value, 100, 'divide')
}
