import { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyPercentage,
  calculate,
  formatNumber,
  OPERATORS,
} from '../logic/calculatorEngine.js'

const HISTORY_STORAGE_KEY = 'calcvin-history'
const MAX_INPUT_LENGTH = 15

const initialState = {
  display: '0',
  expression: '',
  previousValue: null,
  operator: null,
  lastOperator: null,
  waitingForOperand: false,
  justEvaluated: false,
  error: '',
  notice: '',
}

function loadHistory() {
  try {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      throw new Error('Saved calculation history is not a list.')
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.expression === 'string' &&
        typeof item.result === 'string',
    )
  } catch (error) {
    console.error('Unable to load calculation history:', error)
    return []
  }
}

function expressionFor(left, operator) {
  return `${formatNumber(left)} ${OPERATORS[operator].symbol}`
}

export default function useCalculator({ soundEnabled = false } = {}) {
  const [state, setState] = useState(initialState)
  const [history, setHistory] = useState(loadHistory)
  const [animationData, setAnimationData] = useState(null)
  const audioContextRef = useRef(null)

  const playSound = useCallback((kind = 'tap') => {
    if (!soundEnabled || typeof window === 'undefined') return

    const AudioContextConstructor = window.AudioContext
    if (!AudioContextConstructor) return

    try {
      const context = audioContextRef.current ?? new AudioContextConstructor()
      audioContextRef.current = context
      if (context.state === 'suspended') {
        context.resume().catch((error) => {
          console.error('Unable to resume CALCVIN audio:', error)
        })
      }

      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const now = context.currentTime
      const isComplete = kind === 'complete'
      oscillator.type = isComplete ? 'sine' : 'triangle'
      oscillator.frequency.setValueAtTime(isComplete ? 660 : 430, now)
      if (isComplete) oscillator.frequency.exponentialRampToValueAtTime(990, now + 0.12)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(isComplete ? 0.035 : 0.018, now + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (isComplete ? 0.18 : 0.055))
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + (isComplete ? 0.19 : 0.06))
    } catch (error) {
      console.error('Unable to play CALCVIN sound:', error)
    }
  }, [soundEnabled])

  const persistHistory = useCallback((items) => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items))
      return true
    } catch (error) {
      console.error('Unable to save calculation history:', error)
      setState((current) => ({
        ...current,
        notice: 'History could not be saved on this device.',
      }))
      return false
    }
  }, [])

  const inputDigit = useCallback((digit) => {
    setAnimationData(null)
    setState((current) => {
      if (current.error || current.justEvaluated) {
        return { ...initialState, display: digit }
      }
      if (current.waitingForOperand) {
        return { ...current, display: digit, waitingForOperand: false, error: '' }
      }
      if (current.display.replace('-', '').length >= MAX_INPUT_LENGTH) return current

      return {
        ...current,
        display: current.display === '0' ? digit : `${current.display}${digit}`,
        error: '',
      }
    })
  }, [])

  const inputDecimal = useCallback(() => {
    setAnimationData(null)
    setState((current) => {
      if (current.error || current.justEvaluated) {
        return { ...initialState, display: '0.' }
      }
      if (current.waitingForOperand) {
        return { ...current, display: '0.', waitingForOperand: false, error: '' }
      }
      if (current.display.includes('.')) return current
      return { ...current, display: `${current.display}.`, error: '' }
    })
  }, [])

  const chooseOperator = useCallback((nextOperator) => {
    setAnimationData(null)
    setState((current) => {
      if (current.error) return current
      const currentValue = Number(current.display)

      if (current.operator && !current.waitingForOperand) {
        try {
          const result = calculate(current.previousValue, currentValue, current.operator)
          return {
            ...current,
            display: formatNumber(result),
            expression: expressionFor(result, nextOperator),
            previousValue: result,
            operator: nextOperator,
            lastOperator: nextOperator,
            waitingForOperand: true,
            justEvaluated: false,
          }
        } catch (error) {
          return { ...current, display: 'Error', error: error.message }
        }
      }

      return {
        ...current,
        expression: expressionFor(currentValue, nextOperator),
        previousValue: currentValue,
        operator: nextOperator,
        lastOperator: nextOperator,
        waitingForOperand: true,
        justEvaluated: false,
      }
    })
  }, [])

  const evaluate = useCallback(() => {
    if (!state.operator || state.previousValue === null || state.error) return

    const rightValue = state.waitingForOperand ? state.previousValue : Number(state.display)
    const fullExpression = `${formatNumber(state.previousValue)} ${OPERATORS[state.operator].symbol} ${formatNumber(rightValue)}`

    try {
      const result = calculate(state.previousValue, rightValue, state.operator)
      const resultText = formatNumber(result)
      const calculationId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const completedCalculation = {
        id: calculationId,
        operator: state.operator,
        left: state.previousValue,
        right: rightValue,
        result,
      }
      const nextHistory = [
        {
          id: calculationId,
          expression: fullExpression,
          result: resultText,
        },
        ...history,
      ].slice(0, 30)
      setHistory(nextHistory)
      const historySaved = persistHistory(nextHistory)
      setAnimationData(completedCalculation)
      playSound('complete')
      setState({
        ...initialState,
        display: resultText,
        expression: `${fullExpression} =`,
        lastOperator: state.operator,
        notice: historySaved ? '' : 'History could not be saved on this device.',
        justEvaluated: true,
      })
    } catch (error) {
      setAnimationData(null)
      setState({
        ...initialState,
        display: 'Error',
        expression: fullExpression,
        lastOperator: state.operator,
        error: error.message,
      })
    }
  }, [history, persistHistory, playSound, state])

  const percent = useCallback(() => {
    setAnimationData(null)
    setState((current) => {
      if (current.error) return current
      try {
        const result = applyPercentage(Number(current.display))
        return {
          ...current,
          display: formatNumber(result),
          expression: `${current.display} %`,
          waitingForOperand: false,
          justEvaluated: false,
        }
      } catch (error) {
        return { ...current, display: 'Error', error: error.message }
      }
    })
  }, [])

  const toggleSign = useCallback(() => {
    setAnimationData(null)
    setState((current) => {
      if (current.error || current.display === '0') return current
      return {
        ...current,
        display: current.display.startsWith('-')
          ? current.display.slice(1)
          : `-${current.display}`,
        justEvaluated: false,
      }
    })
  }, [])

  const backspace = useCallback(() => {
    setAnimationData(null)
    setState((current) => {
      if (current.error || current.justEvaluated) return initialState
      if (current.waitingForOperand) return current
      const display = current.display.length > 1
        ? current.display.slice(0, -1)
        : '0'
      return { ...current, display: display === '-' ? '0' : display, error: '' }
    })
  }, [])

  const clear = useCallback(() => {
    setAnimationData(null)
    setState(initialState)
  }, [])

  const reuseResult = useCallback((result) => {
    setAnimationData(null)
    setState({ ...initialState, display: result })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    persistHistory([])
  }, [persistHistory])

  const handleKey = useCallback((key) => {
    if (/^\d$/.test(key)) inputDigit(key)
    else if (key === '.') inputDecimal()
    else if (key === '+' || key === '-') chooseOperator(key === '+' ? 'add' : 'subtract')
    else if (key === '*') chooseOperator('multiply')
    else if (key === '/') chooseOperator('divide')
    else if (key === '%') percent()
    else if (key === 'Enter' || key === '=') evaluate()
    else if (key === 'Backspace') backspace()
    else if (key === 'Escape' || key === 'Delete') clear()
    else return false
    return true
  }, [backspace, chooseOperator, clear, evaluate, inputDecimal, inputDigit, percent])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (handleKey(event.key)) {
        event.preventDefault()
        if (event.key !== 'Enter' && event.key !== '=') playSound('tap')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey, playSound])

  return {
    ...state,
    history,
    animationData,
    playSound,
    inputDigit,
    inputDecimal,
    chooseOperator,
    evaluate,
    percent,
    toggleSign,
    backspace,
    clear,
    reuseResult,
    clearHistory,
  }
}
