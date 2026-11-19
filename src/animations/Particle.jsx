import { motion } from 'framer-motion'

export default function Particle({ delay = 0, className = '', initial = {} }) {
  return (
    <motion.span
      className={`math-particle ${className}`}
      initial={{ opacity: 0, scale: 0.25, ...initial }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 280,
        damping: 19,
        mass: 0.7,
      }}
      aria-hidden="true"
    />
  )
}
