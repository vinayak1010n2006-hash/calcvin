import { AnimatePresence, motion } from 'framer-motion'
import useCalculator from '../hooks/useCalculator.js'
import AnimationStage from './AnimationStage.jsx'
import Display from './Display.jsx'
import Keypad from './Keypad.jsx'

export default function Calculator({ historyOpen, soundEnabled }) {
  const calculator = useCalculator({ soundEnabled })

  return (
    <div className={`workspace${historyOpen ? ' workspace-history-open' : ''}`}>
      <section className="calculator-card" aria-label="CALCVIN calculator">
        <Display
          display={calculator.display}
          expression={calculator.expression}
          operator={calculator.operator}
          error={calculator.error}
          notice={calculator.notice}
          isResult={calculator.justEvaluated}
          resultId={calculator.animationData?.id}
        />
        <div className="keypad-heading">
          <span className="eyebrow">YOUR CONTROL ROOM</span>
          <span className="keyboard-hint">KEYBOARD READY <kbd>↵</kbd></span>
        </div>
        <Keypad
          {...calculator}
          operator={calculator.operator}
          onSound={calculator.playSound}
        />
        <div className="keyboard-shortcuts">
          <span><kbd>0–9</kbd> enter</span>
          <span><kbd>⌫</kbd> undo</span>
          <span><kbd>esc</kbd> clear</span>
        </div>
      </section>

      <AnimationStage
        operator={calculator.operator || calculator.lastOperator}
        expression={calculator.expression}
        animationData={calculator.animationData}
      />

      <AnimatePresence>
        {historyOpen && (
          <motion.aside
            className="history-panel"
            aria-label="Calculation history"
            initial={{ opacity: 0, x: 16, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="history-heading">
              <div>
                <span className="eyebrow">YOUR TRAIL</span>
                <h2>History<span>.</span></h2>
              </div>
              {calculator.history.length > 0 && (
                <button className="clear-history" type="button" onClick={calculator.clearHistory}>
                  Clear all
                </button>
              )}
            </div>
            {calculator.history.length ? (
              <ul className="history-list">
                {calculator.history.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.035, 0.2) }}
                  >
                    <button
                      className="history-item"
                      type="button"
                      onClick={() => calculator.reuseResult(item.result)}
                      title={`Use result ${item.result}`}
                    >
                      <span className="history-expression">{item.expression}</span>
                      <span className="history-result">
                        <span>=</span> {item.result}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="history-empty">
                <span className="history-empty-icon">↺</span>
                <strong>Nothing to revisit.</strong>
                <p>Your calculations will find a home here.</p>
              </div>
            )}
            <p className="history-footnote">Stored on this device · Select a result to reuse</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
