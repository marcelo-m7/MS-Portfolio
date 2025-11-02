// Global test setup for Vitest
// - Silences expected console noise from fallback paths during tests
// - Keeps ability to re-enable logs by setting VERBOSE_TEST_LOGS=true

const verbose = typeof process !== 'undefined' && process.env && process.env.VERBOSE_TEST_LOGS === 'true'

if (!verbose) {
  // Preserve originals if needed later
  const originalError = console.error
  const originalWarn = console.warn

  console.error = () => {
    // Swallow known, expected warnings/errors during tests
    // e.g., translation/network fallbacks, mock failures that are asserted via status
    return undefined as unknown as void
  }
  console.warn = () => {
    return undefined as unknown as void
  }

  // Expose a way to restore in rare cases
  ;(globalThis as { __restoreConsole__?: () => void }).__restoreConsole__ = () => {
    console.error = originalError
    console.warn = originalWarn
  }
}
