/**
 * Rate Limiter Middleware
 * 
 * This middleware limits the number of requests a client can make within a specified time window.
 * It uses the `rate-limiter-flexible` library to track and enforce rate limits.
 * 
 * Features:
 * - Limits requests to 10 per minute per IP address.
 * - Returns a 429 status code with a "Too many requests" message when the limit is exceeded.
 * - Logs blocked requests for monitoring purposes.
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// Configure rate limiter: 10 requests per minute per IP
const limiter = new RateLimiterMemory({ points: config.points, duration: config.duration });

/**
 * Rate Limiter Middleware
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    limiter.consume(req.ip || 'unknown-ip')
        .then(() => {
            // Allow the request to proceed
            next();
        })
        .catch(() => {
            // Log the blocked request for monitoring
            logger.warn(`Rate limit exceeded for IP: ${req.ip}`);

            // Respond with a 429 status code
            res.status(429).json({ message: 'Too many requests' });
        });
};
