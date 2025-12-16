import * as fs from 'fs';
import pino, { Logger, LoggerOptions, multistream } from 'pino';

export interface PinoLoggerConfig {
  filePath: string;
  pretty?: boolean;
  level?: string;
  options?: LoggerOptions;
}

/**
 * Creates a Pino logger with file and optional pretty console output
 * @param config - Logger configuration
 * @returns Configured Pino logger instance
 */
export function createPinoLogger(config: PinoLoggerConfig): Logger;
export function createPinoLogger(
  filePath: string,
  pretty?: boolean,
  options?: LoggerOptions,
): Logger;
export function createPinoLogger(
  configOrFilePath: PinoLoggerConfig | string,
  pretty: boolean = false,
  options: LoggerOptions = {},
): Logger {
  let config: PinoLoggerConfig;

  if (typeof configOrFilePath === 'string') {
    config = {
      filePath: configOrFilePath,
      pretty,
      level: 'trace',
      options,
    };
  } else {
    config = configOrFilePath;
  }

  const streams: Array<{ stream: NodeJS.WritableStream; level?: string }> = [
    {
      stream: fs.createWriteStream(config.filePath, { flags: 'a' }),
      level: config.level || 'trace',
    },
  ];

  if (config.pretty) {
    streams.push({
      stream: pino.transport({
        target: 'pino-pretty',
        options: { colorize: true, singleLine: true },
      }) as NodeJS.WritableStream,
      level: config.level || 'trace',
    });
  }

  return pino(
    {
      level: config.level || 'trace',
      timestamp: pino.stdTimeFunctions.isoTime,
      ...config.options,
    },
    multistream(streams),
  );
}
