import fs from 'fs';
import path from 'path';

const logDirectory = '/app/logs'; // Persistent volume mount path
const logFilePath = path.join(logDirectory, 'audit.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Logs a message to a file.
 * @param {string} message - The log message.
 */
export function logToFile(message: string) {
    fs.appendFileSync(logFilePath, message + '\n', 'utf8');
}