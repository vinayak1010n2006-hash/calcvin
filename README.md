# CALCVIN

**Calculate. Animate. Experience.**

CALCVIN is a responsive, keyboard-friendly calculator with a cinematic interface, operation-specific mathematical animations, and locally persisted calculation history.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or check the source with `npm run lint`.

Run the unit/component tests with `npm run test`.

Run the Playwright browser tests with `npm run test:e2e`. Playwright starts the Vite development server automatically. Install Chromium once with `npx playwright install chromium` if it is not already available.

## Use the calculator

- Enter numbers and operators with the keypad or keyboard.
- Press `Enter` or `=` to evaluate; `Backspace` removes a digit.
- Press `Escape` or `Delete` to clear the current calculation.
- Use `%` to divide the current value by 100 and `±` to change its sign.
- Open **History** to reuse a result or clear saved calculations. History is stored in this browser on this device.
- Toggle between dark and light themes from the header.
- Toggle subtle interface sounds from the speaker button; sound is off by default and only plays after an explicit user interaction.

Calculations use explicit arithmetic operations and are displayed to 12 significant digits to avoid common floating-point artifacts. Division by zero is reported in the display.

## Project structure

- `src/logic/calculatorEngine.js` — arithmetic and number formatting
- `src/hooks/useCalculator.js` — calculator state, keyboard input, and history persistence
- `src/components/` — display, keypad, operation stage, and calculator composition
- `src/animations/` — addition, subtraction, multiplication, and division visualizations with capped particle models
- `src/App.jsx` and `src/App.css` — branded application shell and visual system
- `src/index.css` — global styles and typography

The operation stage receives the exact operands and result from each completed calculation. Small whole quantities use discrete particles or grid cells; signed, fractional, and large quantities use bounded, labeled visual fallbacks. Select **Replay** to replay the latest completed operation. Framer Motion coordinates digit, operator, result, ambient, and operation-specific transitions while respecting the reduced-motion preference and preserving arithmetic behavior.
