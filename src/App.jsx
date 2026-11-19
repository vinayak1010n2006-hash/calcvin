import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import Calculator from './components/Calculator.jsx'
import './App.css'

const ambientSymbols = [
  { symbol: '+', className: 'symbol-plus', duration: 17, delay: -5 },
  { symbol: '×', className: 'symbol-times', duration: 21, delay: -12 },
  { symbol: '÷', className: 'symbol-divide', duration: 19, delay: -8 },
  { symbol: '−', className: 'symbol-minus', duration: 23, delay: -16 },
  { symbol: '=', className: 'symbol-equals', duration: 18, delay: -3 },
]

function App() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [lightTheme, setLightTheme] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion="user">
    <main className={`app-shell${lightTheme ? ' theme-light' : ''}`}>
      <div className="ambient ambient-orange" aria-hidden="true" />
      <div className="ambient ambient-violet" aria-hidden="true" />
      <div className="ambient-symbols" aria-hidden="true">
        {ambientSymbols.map(({ symbol, className, duration, delay }) => (
          <motion.span
            className={`ambient-symbol ${className}`}
            key={symbol}
            animate={reduceMotion ? { opacity: 0.18 } : {
              opacity: [0.08, 0.2, 0.08],
              y: [0, -18, 0],
              rotate: [0, 7, 0],
            }}
            transition={reduceMotion ? { duration: 0 } : {
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {symbol}
          </motion.span>
        ))}
      </div>
      <header className="topbar">
        <a className="brand" href="/" aria-label="CALCVIN home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">CALCVIN</span>
        </a>
        <p className="brand-tagline">Calculate. Animate. Experience.</p>
        <div className="header-actions">
          <button
            className={`icon-button${lightTheme ? ' active' : ''}`}
            type="button"
            aria-label={`Switch to ${lightTheme ? 'dark' : 'light'} theme`}
            title={`Switch to ${lightTheme ? 'dark' : 'light'} theme`}
            onClick={() => setLightTheme((current) => !current)}
          >
            {lightTheme ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className={`icon-button sound-toggle${soundEnabled ? ' active' : ''}`}
            type="button"
            aria-label={`Turn sounds ${soundEnabled ? 'off' : 'on'}`}
            aria-pressed={soundEnabled}
            title={`Sounds ${soundEnabled ? 'on' : 'off'}`}
            onClick={() => setSoundEnabled((current) => !current)}
          >
            {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
          <button
            className={`history-toggle${historyOpen ? ' active' : ''}`}
            type="button"
            aria-pressed={historyOpen}
            onClick={() => setHistoryOpen((current) => !current)}
          >
            <HistoryIcon />
            <span>History</span>
          </button>
        </div>
      </header>

      <Calculator historyOpen={historyOpen} soundEnabled={soundEnabled} />

      <footer className="page-footer">
        <span>MADE FOR THE MOMENT</span>
        <span className="footer-status"><i /> CALCVIN SYSTEMS ONLINE</span>
      </footer>
    </main>
    </MotionConfig>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 15.4A8.3 8.3 0 0 1 8.6 3.8 8.4 8.4 0 1 0 20.2 15.4Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.4-5.9L3.5 8.5" />
      <path d="M3.5 3.8v4.7h4.7M12 7v5l3.2 1.9" />
    </svg>
  )
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      <path d="M16 9a5 5 0 0 1 0 6m2.5-8.5a8.5 8.5 0 0 1 0 11" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      <path d="m17 9 5 6m0-6-5 6" />
    </svg>
  )
}

export default App
