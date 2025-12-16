import * as fs from 'fs';
import * as path from 'path';

export interface LogConfig {
  logDir: string;
  appLogFile: string;
  httpLogFile: string;
}

/**
 * Creates a log configuration with default or custom paths
 * @param basePath - Base path for logs directory (default: current working directory)
 * @returns Log configuration object
 */
export function createLogConfig(basePath: string = process.cwd()): LogConfig {
  const logDir = path.resolve(basePath, 'logs');

  return {
    logDir,
    appLogFile: path.join(logDir, 'app.log'),
    httpLogFile: path.join(logDir, 'http.log'),
  };
}

/**
 * Ensures that the log directory exists
 * @param logDir - Path to the log directory
 */
export function ensureLogDirExists(logDir: string): void {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// Default configuration
export const LOG_DIR = path.resolve(process.cwd(), 'logs');
export const APP_LOG_FILE_PATH = path.join(LOG_DIR, 'app.log');
export const HTTP_LOG_FILE_PATH = path.join(LOG_DIR, 'http.log');
