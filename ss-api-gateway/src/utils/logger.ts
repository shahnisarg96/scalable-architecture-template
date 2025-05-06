import winston from "winston";
import { KafkaTransport } from "./kafkaProducer.js";

/**
 * Logger instance configured with multiple transports for logging messages.
 * 
 * Transports:
 * - Console: Logs messages to the console.
 * - File: Logs messages to a file located at `logs/app.log`.
 * - KafkaTransport: Sends log messages to a Kafka topic named `app-logs`.
 * 
 * The logger uses the `info` level by default and formats messages in JSON format.
 * 
 * @constant
 */
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
        new KafkaTransport({ topic: 'app-logs' }),
    ],
});