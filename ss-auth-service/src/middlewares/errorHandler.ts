import { logger } from "../utils/logger.js";

/**
 * Middleware to handle errors in the application.
 *
 * Logs the error details including the HTTP method, original URL, error message, and stack trace.
 * Sends a JSON response with the error message and a trace ID.
 *
 * @param err - The error object containing details about the error.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @remarks
 * - The error message is logged with a timestamp for debugging purposes.
 * - If the error object does not have a status, a default status of 500 (Internal Server Error) is used.
 * - The trace ID is retrieved from the `x-trace-id` header, or defaults to 'N/A' if not provided.
 */
export const errorHandler = (err: any, req: any, res: any, next: any) => {
    logger.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Error: ${err.message} - Stack: ${err.stack}`);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            traceId: req.headers['x-trace-id'] || 'N/A',
        },
    });
}