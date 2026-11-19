import { motion } from 'framer-motion'
import Particle from './Particle.jsx'
import {
  createQuantityModel,
  formatOperand,
  makeParticles,
  particleCount,
  particleUnitCaption,
} from './animationUtils.js'

export default function Subtraction({ calculation }) {
  const { left, right, result } = calculation
  const model = createQuantityModel([left, right, result])
  const removesParticles = model
    && model.units[0] >= 0
    && model.units[1] >= 0
    && model.units[2] >= 0
    && model.units[1] <= model.units[0]
  const addsParticles = model
    && model.units[0] >= 0
    && model.units[1] < 0
    && model.units[2] >= 0
    && model.units[0] - model.units[1] === model.units[2]
  const exactVisual = removesParticles || addsParticles
  const total = exactVisual ? model.units[0] : particleCount(left)
  const removed = removesParticles ? model.units[1] : Math.min(particleCount(right), total)
  const added = addsParticles ? Math.abs(model.units[1]) : 0
  const remaining = exactVisual ? model.units[2] : particleCount(result)
  const reducedVisual = makeParticles(total + added)

  return (
    <div className={`math-animation subtraction-animation${exactVisual ? '' : ' is-scaled'}`}>
      <div className="subtraction-equation">
        <span>{formatOperand(left)}</span>
        <span className="math-operator math-operator-subtract">−</span>
        <span className="subtract-quantity">
          {right < 0 ? `− (${formatOperand(right)})` : `−${formatOperand(right)}`}
        </span>
        <span className="math-equals">=</span>
        <strong>{formatOperand(result)}</strong>
      </div>

      <div className="subtraction-visual">
        <div className="subtraction-particles">
          {reducedVisual.map((particle) => {
            const isAdded = addsParticles && particle.id >= total
            const isRemoved = removesParticles && particle.id >= total - removed
            return (
              <motion.span
                key={particle.id}
                className={`math-particle ${
                  isRemoved ? 'particle-removing' : isAdded ? 'particle-violet' : 'particle-orange'
                }`}
                initial={{ opacity: 0, scale: 0.3, y: 8 }}
                animate={
                  isRemoved
                    ? { opacity: 0, scale: 0.35, x: particle.id % 2 ? 40 : -40, y: -25 }
                    : { opacity: 1, scale: 1, x: 0, y: 0 }
                }
                transition={{
                  delay: isRemoved
                    ? 0.45 + (particle.id % 8) * 0.055
                    : isAdded
                      ? 0.55 + particle.delay
                      : 0.2 + particle.delay,
                  type: 'spring',
                  stiffness: 210,
                  damping: 18,
                }}
              />
            )
          })}
        </div>
        <motion.div
          className="subtraction-result"
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.92, type: 'spring', stiffness: 210, damping: 16 }}
        >
          <span className="eyebrow">LEFT</span>
          <strong>{formatOperand(result)}</strong>
          <span className="remaining-particles" aria-hidden="true">
            {makeParticles(remaining).slice(0, 8).map((particle) => (
              <Particle key={particle.id} delay={1 + particle.delay} className="particle-orange" />
            ))}
          </span>
        </motion.div>
      </div>
      {exactVisual && model.scale > 1 && (
        <span className="visual-fallback-note">{particleUnitCaption(model)}</span>
      )}
      {!exactVisual && (
        <span className="visual-fallback-note">
          Signed or scaled quantity · exact values shown
        </span>
      )}
    </div>
  )
}
