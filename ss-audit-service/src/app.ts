import express, { Application } from 'express'
import { Request, Response } from 'express';

/**
 * Initializes an Express application instance.
 * 
 * The `app` object is the central part of the Express application. 
 * It is used to configure middleware, define routes, and handle requests and responses.
 * 
 * @constant
 * @type {import('express').Express}
 */
const app: Application = express();

/**
 * Health check route.
 * @route GET /health
 */
app.get('/health', (_req: Request, res: Response) => {
    res.send('Audit Service is running')
});

export default app;
