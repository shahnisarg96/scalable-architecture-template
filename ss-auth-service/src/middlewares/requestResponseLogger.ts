import { NextFunction } from "express";
import { logger } from "../utils/logger.js";

/**
 * Middleware to log incoming HTTP requests and their corresponding responses.
 * 
 * This middleware logs the following details for each request:
 * - HTTP method
 * - Original URL
 * - Request headers
 * - Request body
 * 
 * It also logs the following details for each response:
 * - HTTP method
 * - Original URL
 * - HTTP status code
 * - Response time in milliseconds
 * - Response body
 * 
 * The middleware intercepts the `res.write` and `res.end` methods to capture the response body.
 * 
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @param next - The callback to pass control to the next middleware.
 */
export function requestResponseLogger(req: any, res: any, next: NextFunction): void {
    const startTime = Date.now();

    logger.info(`[${new Date().toISOString()}] REQUEST: ${req.method} ${req.originalUrl} - Headers: ${JSON.stringify(req.headers)} - Body: ${JSON.stringify(req.body)}`);

    const chunks: Buffer[] = [];

    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = ((chunk: any, ...args: any[]) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return originalWrite(chunk, ...args);
    }) as typeof res.write;

    res.end = ((chunk: any, ...args: any[]) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const responseBody = Buffer.concat(chunks).toString('utf8');
        const responseTime = Date.now() - startTime;

        logger.info(`[${new Date().toISOString()}] RESPONSE: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ResponseTime: ${responseTime}ms - ResponseBody: ${responseBody}`);

        return originalEnd(chunk, ...args);
    }) as typeof res.end;

    next();
}