import * as fs from 'fs';
import * as path from 'path';

export function appendToLogFile(message: string, fileName = 'http.log') {
  const logFilePath = path.resolve(__dirname, '../../../logs', fileName);
  const logDir = path.dirname(logFilePath);

  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFilePath, message, 'utf8');
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}
