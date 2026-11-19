import { motion } from 'framer-motion'
import { formatOperand } from './animationUtils.js'

const MAX_DIVIDEND_PARTICLES = 24
const MAX_GROUPS = 8

function buildGroups(dividend, divisor, quotient) {
  const wholePerGroup = Math.floor(quotient)
  const remainder = dividend - wholePerGroup * divisor
  const fractionalPart = remainder / divisor

  return Array.from({ length: divisor }, (_, groupIndex) => ({
    id: groupIndex,
    particles: Array.from({ length: wholePerGroup }, (_, particleIndex) => ({
      id: `${groupIndex}-${particleIndex}`,
      partial: false,
    })).concat(
      fractionalPart > 1e-10
        ? [{ id: `${groupIndex}-fraction`, partial: true, fraction: fractionalPart }]
        : [],
    ),
  }))
}

export default function Division({ calculation }) {
  const { left, right, result } = calculation
  const exactGroupCount = Number.isInteger(right) && right > 0 && right <= MAX_GROUPS
  const exactDividend = Number.isInteger(left) && left >= 0 && left <= MAX_DIVIDEND_PARTICLES
  const canGroup = exactGroupCount && exactDividend
  const groups = canGroup ? buildGroups(left, right, result) : []

  return (
    <div className={`math-animation division-animation${canGroup ? '' : ' is-scaled'}`}>
      <div className="division-equation">
        <strong>{formatOperand(left)}</strong>
        <span className="math-operator math-operator-divide">÷</span>
        <strong>{formatOperand(right)}</strong>
        <span className="math-equals">=</span>
        <strong className="division-quotient">{formatOperand(result)}</strong>
        <small>per group</small>
      </div>

      {canGroup ? (
        <>
          <div className="division-flow">
            <motion.div
              className="division-source"
              aria-label={`${left} particles to distribute`}
              animate={{ opacity: [1, 1, 0.16], scale: [1, 1, 0.82] }}
              transition={{ duration: 0.6, times: [0, 0.55, 1], delay: 0.95 }}
            >
              {Array.from({ length: left }, (_, index) => (
                <motion.span
                  key={index}
                  className="math-particle particle-blue"
                  initial={{ opacity: 0, scale: 0.3, y: -18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: index * 0.035,
                    type: 'spring',
                    stiffness: 250,
                    damping: 17,
                  }}
                />
              ))}
            </motion.div>
            <motion.span
              className="division-flow-arrow"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.45, ease: 'easeOut' }}
            />
            <div className="division-groups">
              {groups.map((group) => (
                <div className="division-group" key={group.id}>
                  <div className="division-group-particles">
                    {group.particles.map((particle, index) => (
                      <motion.span
                        key={particle.id}
                        className={`math-particle ${particle.partial ? 'particle-fraction' : 'particle-violet'}`}
                        style={particle.partial ? { '--fraction': particle.fraction } : undefined}
                        initial={{ opacity: 0, scale: 0.3, x: -22, y: -8 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        transition={{
                          delay: 0.55 + group.id * 0.12 + index * 0.055,
                          type: 'spring',
                          stiffness: 230,
                          damping: 17,
                        }}
                      />
                    ))}
                  </div>
                  <span className="eyebrow">GROUP {group.id + 1}</span>
                </div>
              ))}
            </div>
          </div>
          {result % 1 !== 0 && (
            <span className="fraction-note">
              A final particle is split evenly · {formatOperand(result)} in each group
            </span>
          )}
        </>
      ) : (
        <div className="division-scaled-view">
          <div className="division-scaled-source">
            {Array.from({ length: Math.min(Math.ceil(Math.abs(left)), 8) }, (_, index) => (
              <motion.span
                key={index}
                className="math-particle particle-blue"
                initial={{ opacity: 0, scale: 0.3, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.06, type: 'spring', stiffness: 220, damping: 18 }}
              />
            ))}
          </div>
          <div className="division-scaled-result">
            <span className="eyebrow">EQUAL SHARE</span>
            <strong>{formatOperand(result)}</strong>
            <span>per group</span>
          </div>
          <span className="visual-fallback-note">Scaled grouping view · exact values shown</span>
        </div>
      )}
    </div>
  )
}
