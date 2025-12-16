/**
 * Mock logger interface for testing purposes
 * Compatible with Pino logger interface
 */
export interface MockLogger {
  info: jest.Mock;
  error: jest.Mock;
  warn: jest.Mock;
  debug: jest.Mock;
  trace: jest.Mock;
  fatal: jest.Mock;
  child: jest.Mock;
}

/**
 * Creates a mock logger for testing purposes
 * @returns Mock logger object with jest.fn() mocks
 */
export const createMockLogger = (): MockLogger => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  fatal: jest.fn(),
  child: jest.fn().mockReturnThis(),
});

/**
 * Legacy mock logger export for backward compatibility
 * Note: This will only work in test environment where jest is available
 * @deprecated Use createMockLogger() instead
 */
export const mockLogger =
  typeof jest !== 'undefined'
    ? createMockLogger()
    : ({
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
        trace: () => {},
        fatal: () => {},
        child: () => mockLogger,
      } as unknown as MockLogger);
