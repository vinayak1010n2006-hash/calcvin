import { motion } from 'framer-motion'
import { formatOperand } from './animationUtils.js'

const MAX_GRID_CELLS = 48

export default function Multiplication({ calculation }) {
  const { left, right, result } = calculation
  const rows = Number.isInteger(left) && left > 0 ? left : 0
  const columns = Number.isInteger(right) && right > 0 ? right : 0
  const exactGrid = rows <= 8 && columns <= 8 && rows * columns <= MAX_GRID_CELLS

  return (
    <div className={`math-animation multiplication-animation${exactGrid ? '' : ' is-scaled'}`}>
      {exactGrid ? (
        <>
          <div className="multiplication-equation">
            <span>{formatOperand(left)}</span>
            <span className="math-operator math-operator-multiply">×</span>
            <span>{formatOperand(right)}</span>
            <span className="math-equals">=</span>
            <strong>{formatOperand(result)}</strong>
          </div>
          <div
            className="multiplication-grid"
            style={{ '--grid-columns': columns }}
            aria-label={`${rows} rows by ${columns} columns`}
          >
            {Array.from({ length: rows * columns }, (_, index) => (
              <motion.span
                key={index}
                className="grid-cell"
                initial={{ opacity: 0, scale: 0.15, rotate: -35 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.12 + index * 0.045,
                  type: 'spring',
                  stiffness: 280,
                  damping: 16,
                }}
                whileInView={{ boxShadow: '0 0 19px rgba(156, 123, 255, 0.5)' }}
                viewport={{ once: true }}
              />
            ))}
          </div>
          <motion.div
            className="grid-total"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.35 }}
          >
            <span>{rows} rows × {columns} columns</span>
            <strong>{formatOperand(result)} <small>cells</small></strong>
          </motion.div>
        </>
      ) : (
        <>
          <div className="scaled-multiplication">
            <motion.div
              className="scaled-factor factor-one"
              initial={{ x: -18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            >
              <span className="eyebrow">FACTOR</span>
              <strong>{formatOperand(left)}</strong>
            </motion.div>
            <span className="math-operator math-operator-multiply">×</span>
            <motion.div
              className="scaled-factor factor-two"
              initial={{ x: 18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.12 }}
            >
              <span className="eyebrow">FACTOR</span>
              <strong>{formatOperand(right)}</strong>
            </motion.div>
          </div>
          <motion.div
            className="scaled-product"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.4 }}
          >
            <span className="eyebrow">PRODUCT</span>
            <strong>{formatOperand(result)}</strong>
          </motion.div>
          <span className="visual-fallback-note">Scaled factor view · exact values shown</span>
        </>
      )}
    </div>
  )
}
