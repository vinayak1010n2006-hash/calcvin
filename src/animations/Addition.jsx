import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Particle from './Particle.jsx'
import {
  createQuantityModel,
  formatOperand,
  makeParticles,
  particleCount,
  particleUnitCaption,
} from './animationUtils.js'

export default function Addition({ calculation }) {
  const { left, right, result } = calculation
  const [merged, setMerged] = useState(false)
  const model = createQuantityModel([left, right, result])
  const leftCount = model ? Math.abs(model.units[0]) : particleCount(left)
  const rightCount = model ? Math.abs(model.units[1]) : particleCount(right)
  const resultCount = model ? Math.abs(model.units[2]) : particleCount(result)

  useEffect(() => {
    const timer = window.setTimeout(() => setMerged(true), 1050)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={`math-animation addition-animation${merged ? ' is-merged' : ''}`}>
      <div className="addition-groups">
        <motion.div
          className={`particle-group particle-group-orange${merged ? ' group-merged' : ''}`}
          animate={{ x: merged ? 30 : -17, opacity: merged ? 0 : 1, scale: merged ? 0.45 : 1 }}
          transition={{ type: 'spring', stiffness: 115, damping: 20, delay: merged ? 0 : 0.1 }}
          aria-label={`First operand ${formatOperand(left)}`}
        >
          <div className="particle-field">
            {makeParticles(leftCount).map((particle) => (
              <Particle key={particle.id} delay={particle.delay} className="particle-orange" />
            ))}
          </div>
          <span className="particle-value">{formatOperand(left)}</span>
        </motion.div>

        <motion.span
          className="math-operator math-operator-add"
          animate={{ opacity: merged ? 0 : 1, scale: merged ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          +
        </motion.span>

        <motion.div
          className={`particle-group particle-group-violet${merged ? ' group-merged' : ''}`}
          animate={{ x: merged ? -30 : 17, opacity: merged ? 0 : 1, scale: merged ? 0.45 : 1 }}
          transition={{ type: 'spring', stiffness: 115, damping: 20, delay: merged ? 0 : 0.1 }}
          aria-label={`Second operand ${formatOperand(right)}`}
        >
          <div className="particle-field">
            {makeParticles(rightCount).map((particle) => (
              <Particle key={particle.id} delay={particle.delay} className="particle-violet" />
            ))}
          </div>
          <span className="particle-value">{formatOperand(right)}</span>
        </motion.div>
      </div>

      <motion.div
        className="addition-result"
        initial={false}
        animate={{ opacity: merged ? 1 : 0, scale: merged ? 1 : 0.72, y: merged ? 0 : 9 }}
        transition={{ type: 'spring', stiffness: 190, damping: 17, delay: merged ? 0.08 : 0 }}
      >
        <div className="result-particles">
          {makeParticles(resultCount).map((particle) => (
            <Particle key={particle.id} delay={Math.min(particle.delay, 0.32)} className="particle-result" />
          ))}
        </div>
        <span className="result-reveal-number">{formatOperand(result)}</span>
        <span className="result-reveal-label">merged total</span>
      </motion.div>
      {model?.scale > 1 && (
        <span className="visual-fallback-note">{particleUnitCaption(model)}</span>
      )}
      {!model && <span className="visual-fallback-note">Scaled particle view · exact values shown</span>}
    </div>
  )
}
