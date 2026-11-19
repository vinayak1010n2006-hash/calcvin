import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Addition from '../animations/Addition.jsx'
import Division from '../animations/Division.jsx'
import Multiplication from '../animations/Multiplication.jsx'
import Subtraction from '../animations/Subtraction.jsx'
import { formatEquation } from '../animations/animationUtils.js'
import { OPERATORS } from '../logic/calculatorEngine.js'

const operationVisuals = {
  add: { symbol: '+', name: 'Addition', caption: 'Two quantities, one brighter whole' },
  subtract: { symbol: '−', name: 'Subtraction', caption: 'Watch a quantity make space' },
  multiply: { symbol: '×', name: 'Multiplication', caption: 'A pattern becomes a product' },
  divide: { symbol: '÷', name: 'Division', caption: 'One quantity, shared equally' },
}

const animationComponents = {
  add: Addition,
  subtract: Subtraction,
  multiply: Multiplication,
  divide: Division,
}

export default function AnimationStage({ operator, expression, animationData }) {
  const [replay, setReplay] = useState(0)
  const reduceMotion = useReducedMotion()
  const selectedOperator = animationData?.operator || operator
  const selected = selectedOperator ? operationVisuals[selectedOperator] : null
  const operation = selectedOperator ? OPERATORS[selectedOperator] : null
  const Animation = animationData ? animationComponents[animationData.operator] : null
  const stageExpression = animationData
    ? `${formatEquation(animationData)} = ${animationData.result}`
    : expression

  return (
    <section className="stage-panel" aria-label="Animation stage">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">THE PLAYGROUND</span>
          <h2>Numbers in motion<span>.</span></h2>
        </div>
        <span className="stage-index">01 <i /> 04</span>
      </div>

      <div className={`stage-visual${selected ? ' stage-selected' : ''}`}>
        <div className="stage-grid" aria-hidden="true" />
        <div className="stage-orbit orbit-one" aria-hidden="true" />
        <div className="stage-orbit orbit-two" aria-hidden="true" />
        <motion.span
          className="stage-spark stage-spark-one"
          aria-hidden="true"
          animate={reduceMotion ? { opacity: 0.65 } : { opacity: [0.2, 0.85, 0.2], scale: [0.75, 1.2, 0.75] }}
          transition={reduceMotion
            ? { duration: 0 }
            : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="stage-spark stage-spark-violet stage-spark-two"
          aria-hidden="true"
          animate={reduceMotion ? { opacity: 0.65 } : { opacity: [0.25, 0.9, 0.25], x: [0, -5, 0], y: [0, -7, 0] }}
          transition={reduceMotion
            ? { duration: 0 }
            : { duration: 5.5, delay: -2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="stage-spark stage-spark-violet stage-spark-three"
          aria-hidden="true"
          animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.15, 0.8, 0.15], scale: [0.8, 1.3, 0.8] }}
          transition={reduceMotion
            ? { duration: 0 }
            : { duration: 6, delay: -3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <AnimatePresence mode="wait" initial={false}>
          {animationData && Animation ? (
            <motion.div
              className="stage-content stage-content-animation"
              key={`${animationData.id}-${replay}`}
              initial={{ opacity: 0, scale: 0.96, y: 9 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -7 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
            >
              <Animation calculation={animationData} />
            </motion.div>
          ) : selected ? (
            <motion.div
              className="stage-content stage-content-prompt"
              key={`prompt-${selectedOperator}`}
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className={`operation-orb orb-${selectedOperator}`}
                animate={{ y: [0, -7, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {selected.symbol}
                <span className="orb-ring" />
              </motion.div>
              <span className="stage-operation">{selected.name}</span>
              <span className="stage-caption">Complete a calculation to set it in motion</span>
            </motion.div>
          ) : (
            <motion.div
              className="stage-content stage-content-prompt"
              key="idle"
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="idle-constellation" aria-hidden="true">
                <span className="constellation-dot dot-a" />
                <span className="constellation-dot dot-b" />
                <span className="constellation-dot dot-c" />
                <span className="constellation-dot dot-d" />
                <span className="constellation-line line-a" />
                <span className="constellation-line line-b" />
                <span className="constellation-line line-c" />
              </div>
              <span className="stage-operation">A little bit of wonder</span>
              <span className="stage-caption">Choose an operation to begin</span>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="stage-corner stage-corner-top" aria-hidden="true" />
        <span className="stage-corner stage-corner-bottom" aria-hidden="true" />
      </div>

      <div className="stage-bottom">
        <div className="stage-current">
          <span className="stage-current-icon">{operation?.symbol || '∑'}</span>
          <div>
            <span className="eyebrow">{animationData ? 'LAST REVEAL' : 'CURRENT FOCUS'}</span>
            <strong>{operation?.displayName || 'AWAITING INPUT'}</strong>
          </div>
        </div>
        <span className="stage-expression">{stageExpression || '—'}</span>
        {animationData && (
          <motion.button
            className="replay-animation"
            type="button"
            onClick={() => setReplay((value) => value + 1)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            aria-label={`Replay ${selected.name} animation`}
            title="Replay animation"
          >
            <ReplayIcon />
            <span>Replay</span>
          </motion.button>
        )}
      </div>
      <p className="stage-note">
        {animationData ? 'Actual operands. Actual result. One little reveal.' : 'The math is real. The magic is next.'}
      </p>
    </section>
  )
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.6-2L20 12M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.6 2L4 12" />
    </svg>
  )
}
