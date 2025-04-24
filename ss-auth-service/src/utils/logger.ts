import winston from "winston";

/**
 * A logger instance configured using Winston library.
 * 
 * The logger is set to the 'info' level by default and uses JSON formatting.
 * It outputs logs to both the console and a file located at 'logs/app.log'.
 * 
 * Transports:
 * - Console: Logs are displayed in the console.
 * - File: Logs are written to 'logs/app.log'.
 * 
 * @constant
 */
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});