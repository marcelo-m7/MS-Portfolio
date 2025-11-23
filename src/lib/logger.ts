/**
 * Structured logger utility for development and production environments.
 * 
 * In production mode:
 * - log(), info() are suppressed
 * - warn() logs to console.warn
 * - error() logs to console.error
 * 
 * In development mode:
 * - All levels log to their respective console methods
 * - Includes timestamps and styled output
 * 
 * Future integration points:
 * - Add Sentry/LogRocket integration for error() in production
 * - Add structured logging metadata (userId, sessionId, etc.)
 * - Add log aggregation service
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

const isDevelopment = import.meta.env.DEV;

/**
 * Format log message with timestamp and context
 */
function formatMessage(
  level: LogLevel,
  message: string,
  context?: LogContext
): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (context?.component) {
    return `${prefix} [${context.component}] ${message}`;
  }
  
  return `${prefix} ${message}`;
}

/**
 * Get console style for development mode
 */
function getLogStyle(level: LogLevel): string {
  const styles: Record<LogLevel, string> = {
    log: 'color: #888',
    info: 'color: #0066cc',
    warn: 'color: #ff9900',
    error: 'color: #cc0000; font-weight: bold',
  };
  return styles[level];
}

/**
 * Internal logging function
 */
function doLog(
  level: LogLevel,
  message: string,
  context?: LogContext,
  ...args: unknown[]
): void {
  const formattedMessage = formatMessage(level, message, context);
  
  if (isDevelopment) {
    // Styled output in development
    console[level](
      `%c${formattedMessage}`,
      getLogStyle(level),
      ...args
    );
    
    // Log metadata separately if provided
    if (context?.metadata && Object.keys(context.metadata).length > 0) {
      console[level]('Metadata:', context.metadata);
    }
  } else {
    // Production: only warn and error are logged
    if (level === 'warn' || level === 'error') {
      console[level](formattedMessage, ...args);
      
      // TODO: Send errors to monitoring service (Sentry, LogRocket, etc.)
      // if (level === 'error') {
      //   sendToErrorMonitoring(message, args, context);
      // }
    }
  }
}

/**
 * Logger utility with structured methods
 */
export const logger = {
  /**
   * General logging (suppressed in production)
   */
  log(message: string, context?: LogContext, ...args: unknown[]): void {
    doLog('log', message, context, ...args);
  },

  /**
   * Informational messages (suppressed in production)
   */
  info(message: string, context?: LogContext, ...args: unknown[]): void {
    doLog('info', message, context, ...args);
  },

  /**
   * Warning messages (logged in both dev and prod)
   */
  warn(message: string, context?: LogContext, ...args: unknown[]): void {
    doLog('warn', message, context, ...args);
  },

  /**
   * Error messages (logged in both dev and prod, future error tracking integration)
   */
  error(message: string, context?: LogContext, ...args: unknown[]): void {
    doLog('error', message, context, ...args);
  },

  /**
   * Utility to create a component-scoped logger
   * 
   * Example:
   * ```ts
   * const log = logger.scope('ContactForm');
   * log.error('Failed to submit', { metadata: { userId: 123 } });
   * // Output: [timestamp] [ERROR] [ContactForm] Failed to submit
   * ```
   */
  scope(component: string) {
    return {
      log: (message: string, metadata?: Record<string, unknown>, ...args: unknown[]) =>
        logger.log(message, { component, metadata }, ...args),
      info: (message: string, metadata?: Record<string, unknown>, ...args: unknown[]) =>
        logger.info(message, { component, metadata }, ...args),
      warn: (message: string, metadata?: Record<string, unknown>, ...args: unknown[]) =>
        logger.warn(message, { component, metadata }, ...args),
      error: (message: string, metadata?: Record<string, unknown>, ...args: unknown[]) =>
        logger.error(message, { component, metadata }, ...args),
    };
  },
};

/**
 * Default export for convenience
 */
export default logger;
