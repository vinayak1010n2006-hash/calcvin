export const MAX_PARTICLES = 24

function decimalPlaces(value) {
  const text = Math.abs(value).toString().toLowerCase()
  if (text.includes('e')) return 99
  const decimal = text.split('.')[1]
  return decimal ? decimal.length : 0
}

export function createQuantityModel(values, cap = MAX_PARTICLES) {
  if (!values.every(Number.isFinite)) return null

  const places = Math.max(...values.map(decimalPlaces))
  if (places > 3) return null

  const scale = 10 ** places
  const units = values.map((value) => Math.round(value * scale))
  if (
    !units.every(Number.isSafeInteger) ||
    units.some((value) => Math.abs(value) > cap) ||
    units.some((value, index) => Math.abs(value / scale - values[index]) > 1e-10)
  ) {
    return null
  }

  return { scale, units }
}

export function particleCount(value, cap = MAX_PARTICLES) {
  return value === 0 ? 0 : Math.min(Math.ceil(Math.abs(value)), cap)
}

export function formatOperand(value) {
  return Object.is(value, -0) ? '0' : String(value)
}

export function particleUnitCaption(model) {
  return model?.scale > 1
    ? `Each particle represents ${formatOperand(1 / model.scale)} units`
    : ''
}

export function formatEquation({ left, operator, right }) {
  const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' }
  return `${formatOperand(left)} ${symbols[operator]} ${formatOperand(right)}`
}

export function makeParticles(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    delay: Math.min(index * 0.035, 0.55),
    x: ((index % 5) - 2) * 4,
    y: (Math.floor(index / 5) - 2) * 4,
  }))
}
