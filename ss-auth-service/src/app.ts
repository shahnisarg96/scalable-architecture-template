import express from 'express'
import authRoutes from './routes/auth.routes.js'
import { requestResponseLogger } from './middlewares/requestResponseLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';

/**
 * Initializes an Express application instance.
 * 
 * The `app` object is the central part of the Express application. 
 * It is used to configure middleware, define routes, and handle requests and responses.
 * 
 * @constant
 * @type {import('express').Express}
 */
const app = express();

/**
 * Middleware to parse incoming requests with JSON payloads.
 * This middleware is based on the body-parser library and is included in Express starting from version 4.16.0.
 * 
 * @see {@link https://expressjs.com/en/4x/api.html#express.json}
 */
app.use(express.json());

/**
 * Middleware for logging requests and responses.
 * This middleware logs the details of incoming requests and outgoing responses for debugging purposes.
 */
app.use(requestResponseLogger);

/**
 * Middleware for handling authentication routes.
 * This middleware mounts the authentication routes defined in the authRoutes module.
 * 
 * @see {@link ./routes/auth.routes.js}
 */
app.use('/auth', authRoutes)

/**
 * Middleware for handling errors.
 * This middleware catches and handles errors that occur during request processing.
 * 
 * @see {@link ./middlewares/errorHandler.js}
 */
app.use(errorHandler);

export default app;
    