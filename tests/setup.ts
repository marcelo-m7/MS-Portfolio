// Global test setup for Vitest (tests/)
const verbose = typeof process !== 'undefined' && process.env && process.env.VERBOSE_TEST_LOGS === 'true'

if (!verbose) {
  const originalError = console.error
  const originalWarn = console.warn
  console.error = () => undefined as unknown as void
  console.warn = () => undefined as unknown as void
  ;(globalThis as { __restoreConsole__?: () => void }).__restoreConsole__ = () => {
    console.error = originalError
    console.warn = originalWarn
  }
}
