import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve(__dirname, '../../../logs');

export function ensureLogDirExists(): void {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function appendToLogFile(message: string, fileName = 'http.log') {
  const logFilePath = path.join(LOG_DIR, fileName);

  try {
    fs.appendFileSync(logFilePath, message, 'utf8');
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}
