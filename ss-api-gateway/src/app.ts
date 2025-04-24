import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { setupRoutes } from './routes/index.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { logger } from './utils/logger.js';
import { config } from './config/index.js';
import { randomBytes } from 'crypto';
import { requestResponseLogger } from './middlewares/requestResponseLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerRoute } from './routes/swagger.js';

const app = express();

// Middleware: Enable CORS
app.use(cors({
    origin: '*', // Replace with specific origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-trace-id'],
}));

// Middleware: Add security headers
app.use(helmet());

// Middleware: Parse JSON payloads
app.use(express.json());

// Middleware: Rate limiting
app.use(rateLimiter);

// Middleware: Custom timeout handler
app.use((_req, res, next) => {
    const timeoutDuration = Number(config.requestTimeout);
    res.setTimeout(Number(timeoutDuration), () => {
        res.status(503).json({ error: 'Request timed out. Please try again later.' });
    });
    next();
});

// Middleware: Custom header for traceability
app.use((req, res, next) => {
    const traceId = randomBytes(16).toString('hex'); // 32-character hex string
    req.headers['x-trace-id'] = traceId;
    res.setHeader('x-trace-id', traceId);
    next();
});

// Middleware: Request and response logging
app.use(requestResponseLogger);

// Register all routes
setupRoutes(app);

// Swagger UI route
swaggerRoute(app); 

// Middleware: 404 Not Found handler
app.use((_req, res) => {
    res.status(404).json({
        code: 404,
        status: "Error",
        message: "Route not found.",
        data: null,
    });
});

// Middleware: Centralized error handling
app.use((errorHandler));

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Closing server...');
    process.exit(0);
});

export default app;