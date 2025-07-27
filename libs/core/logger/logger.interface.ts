export interface LoggerInterface {
  log(data: Record<string, unknown>): void;
  error(data: Record<string, unknown>): void;
  warn(data: Record<string, unknown>): void;
  debug(data: Record<string, unknown>): void;
  verbose(data: Record<string, unknown>): void;
}
