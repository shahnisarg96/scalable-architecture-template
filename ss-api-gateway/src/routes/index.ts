import { Express, Request, Response } from 'express';
import { config } from '../config/index.js';
import { createServiceProxy } from '../utils/proxy.js';

/**
 * Sets up application routes.
 * @param app - The Express application instance.
 */
export function setupRoutes(app: Express) {
  /**
   * Health check route.
   * @route GET /health
   */
  app.get('/health', (_: Request, res: Response) => {
    res.json({ status: 'UP' });
  });

  /**
   * Timeout simulation route.
   * Simulates a delayed response for testing purposes.
   * @route GET /timeout
   */
  app.get('/timeout', (_: Request, res: Response) => {
    setTimeout(() => {
      res.json({ message: 'This is a delayed response' });
    }, 15000); // 15 seconds delay
  });

  // Public auth routes
  app.use('/auth', createServiceProxy(config.AUTH_SERVICE_URL, { '^/auth': '/auth' }));

  // Protected routes
  app.use('/students', createServiceProxy(config.STUDENT_SERVICE_URL, { '^/students': '/students' }, true));
  app.use('/courses', createServiceProxy(config.COURSE_SERVICE_URL, { '^/courses': '/courses' }, true));
  app.use('/faculty', createServiceProxy(config.FACULTY_SERVICE_URL, { '^/faculty': '/faculty' }, true));
  app.use('/enrollment', createServiceProxy(config.ENROLLMENT_SERVICE_URL, { '^/enrollment': '/enrollment' }, true));
}