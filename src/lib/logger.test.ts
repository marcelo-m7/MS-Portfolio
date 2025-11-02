/**
 * Tests for logger utility
 * 
 * Testing strategy:
 * - Mock console methods to verify correct behavior
 * - Test dev vs production mode differences
 * - Test component-scoped loggers
 */

import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { logger } from './logger';

// Save original console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

describe('logger utility', () => {
  beforeEach(() => {
    // Mock all console methods
    console.log = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('in development mode', () => {
    it('should call console.log for logger.log()', () => {
      logger.log('Test log message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should call console.info for logger.info()', () => {
      logger.info('Test info message');
      expect(console.info).toHaveBeenCalled();
    });

    it('should call console.warn for logger.warn()', () => {
      logger.warn('Test warning message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should call console.error for logger.error()', () => {
      logger.error('Test error message');
      expect(console.error).toHaveBeenCalled();
    });

  it('should include component name in scoped logger', () => {
      const scopedLogger = logger.scope('TestComponent');
      scopedLogger.error('Test error');
      
      expect(console.error).toHaveBeenCalled();
      const firstCallArg = (console.error as unknown as Mock).mock.calls[0][0];
      expect(firstCallArg).toContain('[TestComponent]');
    });

    it('should include metadata when provided', () => {
      logger.error('Test with metadata', { 
        component: 'TestComponent',
        metadata: { userId: 123, action: 'submit' }
      });
      
      expect(console.error).toHaveBeenCalledTimes(2); // Once for message, once for metadata
    });
  });

  describe('component-scoped logger', () => {
    it('should create scoped logger with component name', () => {
      const scopedLogger = logger.scope('MyComponent');
      
      scopedLogger.log('Test message');
      expect(console.log).toHaveBeenCalled();
      
      const firstCallArg = (console.log as unknown as Mock).mock.calls[0][0];
      expect(firstCallArg).toContain('[MyComponent]');
    });

    it('should accept metadata in scoped logger', () => {
      const scopedLogger = logger.scope('MyComponent');
      
      scopedLogger.error('Error occurred', { action: 'save', status: 'failed' });
      expect(console.error).toHaveBeenCalled();
    });

    it('should support all log levels in scoped logger', () => {
      const scopedLogger = logger.scope('TestComponent');
      
      scopedLogger.log('log message');
      scopedLogger.info('info message');
      scopedLogger.warn('warn message');
      scopedLogger.error('error message');
      
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('message formatting', () => {
    it('should include timestamp in formatted message', () => {
      logger.error('Test error');
      
      const firstCallArg = (console.error as unknown as Mock).mock.calls[0][0];
      // Check for ISO timestamp format (YYYY-MM-DD)
      expect(firstCallArg).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('should include log level in formatted message', () => {
      logger.warn('Test warning');
      
      const firstCallArg = (console.warn as unknown as Mock).mock.calls[0][0];
      expect(firstCallArg).toContain('[WARN]');
    });

    it('should format error level correctly', () => {
      logger.error('Test error');
      
      const firstCallArg = (console.error as unknown as Mock).mock.calls[0][0];
      expect(firstCallArg).toContain('[ERROR]');
    });
  });

  describe('additional arguments', () => {
    it('should pass additional arguments to console', () => {
      const errorObj = new Error('Test error');
      const metadata = { code: 500 };
      
      logger.error('Error occurred', { component: 'API' }, errorObj, metadata);
      
      expect(console.error).toHaveBeenCalled();
      // First call has formatted message and additional args
      const calls = (console.error as unknown as Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });
  });
});
