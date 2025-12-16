import * as fs from 'fs';
import * as path from 'path';

export interface LoggerConfig {
  logDir?: string;
  defaultFileName?: string;
}

/**
 * Creates a simple file logger
 */
export class FileLogger {
  private readonly logDir: string;
  private readonly defaultFileName: string;

  constructor(config: LoggerConfig = {}) {
    this.logDir = config.logDir || path.resolve(process.cwd(), 'logs');
    this.defaultFileName = config.defaultFileName || 'app.log';
    this.ensureLogDirExists();
  }

  private ensureLogDirExists(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Appends a message to a log file
   * @param message - The message to log
   * @param fileName - Optional custom file name (default: configured default)
   */
  appendToLogFile(message: string, fileName?: string): void {
    const logFilePath = path.join(
      this.logDir,
      fileName || this.defaultFileName,
    );

    try {
      fs.appendFileSync(logFilePath, message, 'utf8');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use FileLogger class instead
 */
export function appendToLogFile(message: string, fileName = 'http.log'): void {
  const logger = new FileLogger({ defaultFileName: fileName });
  logger.appendToLogFile(message, fileName);
}
