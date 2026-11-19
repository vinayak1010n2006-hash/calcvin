import { motion } from 'framer-motion'

const rows = [
  [
    { label: 'AC', action: 'clear', type: 'utility' },
    { label: '±', action: 'sign', type: 'utility' },
    { label: '%', action: 'percent', type: 'utility' },
    { label: '÷', action: 'divide', type: 'operator' },
  ],
  [
    { label: '7', action: 'digit', type: 'number' },
    { label: '8', action: 'digit', type: 'number' },
    { label: '9', action: 'digit', type: 'number' },
    { label: '×', action: 'multiply', type: 'operator' },
  ],
  [
    { label: '4', action: 'digit', type: 'number' },
    { label: '5', action: 'digit', type: 'number' },
    { label: '6', action: 'digit', type: 'number' },
    { label: '−', action: 'subtract', type: 'operator' },
  ],
  [
    { label: '1', action: 'digit', type: 'number' },
    { label: '2', action: 'digit', type: 'number' },
    { label: '3', action: 'digit', type: 'number' },
    { label: '+', action: 'add', type: 'operator' },
  ],
  [
    { label: '⌫', action: 'backspace', type: 'utility', accessible: 'Backspace' },
    { label: '0', action: 'digit', type: 'number', wide: true },
    { label: '.', action: 'decimal', type: 'number' },
    { label: '=', action: 'equals', type: 'equals' },
  ],
]

export default function Keypad({
  inputDigit,
  inputDecimal,
  chooseOperator,
  evaluate,
  percent,
  toggleSign,
  backspace,
  clear,
  operator,
  onSound,
}) {
  const actions = {
    digit: (label) => inputDigit(label),
    decimal: inputDecimal,
    add: () => chooseOperator('add'),
    subtract: () => chooseOperator('subtract'),
    multiply: () => chooseOperator('multiply'),
    divide: () => chooseOperator('divide'),
    equals: evaluate,
    percent,
    sign: toggleSign,
    backspace,
    clear,
  }

  return (
    <div className="keypad" role="group" aria-label="Calculator keypad">
      {rows.flatMap((row, rowIndex) =>
        row.map((key) => {
          const isActive = ['add', 'subtract', 'multiply', 'divide'].includes(key.action)
            && operator === key.action
          return (
            <motion.button
              key={key.label}
              type="button"
              className={`key key-${key.type}${key.wide ? ' key-wide' : ''}${isActive ? ' key-active' : ''}`}
              aria-label={key.accessible || key.label}
              aria-pressed={key.type === 'operator' ? isActive : undefined}
              onClick={() => {
                onSound?.('tap')
                actions[key.action](key.label)
              }}
              whileHover={{ y: -2, scale: key.type === 'equals' ? 1.035 : 1.025 }}
              whileTap={key.type === 'equals'
                ? { scale: 0.91, y: 1, filter: 'brightness(1.18)' }
                : { scale: 0.94, y: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              style={{ '--key-order': rowIndex * 4 }}
            >
              {key.action === 'backspace' ? <BackspaceIcon /> : key.label}
            </motion.button>
          )
        }),
      )}
    </div>
  )
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5H20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-7-7 7-7Z" />
      <path d="m12 9 6 6m0-6-6 6" />
    </svg>
  )
}
