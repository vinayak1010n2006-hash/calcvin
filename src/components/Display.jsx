import { AnimatePresence, motion } from 'framer-motion'
import { OPERATORS } from '../logic/calculatorEngine.js'

export default function Display({
  display,
  expression,
  operator,
  error,
  notice,
  isResult,
  resultId,
}) {
  const selectedOperation = operator ? OPERATORS[operator] : null
  const resultLength = display.length
  const displayDigits = [...display].map((character, index) => ({
    character,
    position: display.length - index,
  }))

  return (
    <section className="display-panel" aria-label="Calculation display">
      <div className="display-meta">
        <span className="eyebrow"><i /> LIVE CALCULATION</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={selectedOperation?.displayName ?? 'ready'}
            className={`operation-chip${selectedOperation ? ' selected' : ''}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
          >
            {selectedOperation ? selectedOperation.displayName : 'READY'}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="expression-line" aria-live="polite">
        <motion.span
          className="expression-copy"
          key={expression || 'empty'}
          layout
          initial={{ opacity: 0.55, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          {isResult ? expression.replace(/ =$/, '') : expression || 'Your next move starts here'}
        </motion.span>
        {isResult && (
          <motion.span
            className="equals-reveal"
            initial={{ opacity: 0, scale: 0.55, rotate: -18, y: -4 }}
            animate={{ opacity: 1, scale: [0.55, 1.18, 1], rotate: 0, y: 0 }}
            transition={{ duration: 0.34, times: [0, 0.62, 1], ease: [0.16, 1, 0.3, 1] }}
            aria-label="equals"
          >
            =
          </motion.span>
        )}
        {selectedOperation && (
          <motion.span
            className={`operator-indicator operator-${operator}`}
            key={selectedOperation.symbol}
            initial={{ scale: 0.55, rotate: operator === 'multiply' ? 45 : -18, opacity: 0, y: 5 }}
            animate={{ scale: [0.55, 1], rotate: 0, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 19 }}
            aria-label={`${selectedOperation.name} selected`}
          >
            {selectedOperation.symbol}
          </motion.span>
        )}
      </div>

      <div className={`result-line${resultLength > 12 ? ' result-long' : ''}`} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.output
            layout
            key={isResult ? `result-${resultId}` : `display-${display}`}
            className={`result-value${error ? ' result-error' : ''}${isResult ? ' result-cinematic' : ''}`}
            aria-label={display}
            initial={isResult
              ? { opacity: 0, y: 12, scale: 0.78, filter: 'blur(9px)' }
              : { opacity: 0, y: 9, scale: 0.94, filter: 'blur(5px)' }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              textShadow: isResult
                ? '0 0 30px rgb(255, 134, 71)'
                : 'none',
            }}
            exit={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(4px)' }}
            transition={{
              layout: { type: 'spring', stiffness: 280, damping: 28 },
              duration: isResult ? 0.34 : 0.2,
              delay: isResult ? 0.08 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {displayDigits.map(({ character, position }) => (
                <motion.span
                  className="rolling-digit"
                  key={`${position}-${character}`}
                  initial={{ opacity: 0, y: 11, scale: 0.86 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -9, scale: 0.9 }}
                  transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  {character}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.output>
        </AnimatePresence>
        <span className="result-caret" aria-hidden="true" />
      </div>
      <p className={`display-hint${error ? ' display-error' : notice ? ' display-warning' : ''}`}>
        {error || notice || (operator ? `${selectedOperation.name} in progress` : 'Precision, with a little personality.')}
      </p>
    </section>
  )
}
