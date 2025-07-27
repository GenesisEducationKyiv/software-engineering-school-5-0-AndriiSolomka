import * as fs from 'fs';
import pino, { Logger, LoggerOptions, multistream } from 'pino';

export function createPinoLogger(
  filePath: string,
  pretty: boolean = false,
  options: LoggerOptions = {},
): Logger {
  const streams: Array<{ stream: NodeJS.WritableStream; level?: string }> = [
    { stream: fs.createWriteStream(filePath, { flags: 'a' }), level: 'trace' },
  ];

  if (pretty) {
    streams.push({
      stream: pino.transport({
        target: 'pino-pretty',
        options: { colorize: true, singleLine: true },
      }) as NodeJS.WritableStream,
      level: 'trace',
    });
  }

  return pino(
    {
      level: 'trace',
      timestamp: pino.stdTimeFunctions.isoTime,
      ...options,
    },
    multistream(streams),
  );
}
