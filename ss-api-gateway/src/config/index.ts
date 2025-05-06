import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuration object for the API Gateway.
 * This object contains various service URLs and the port on which the gateway runs.
 */
export const config = {
  port: process.env.PORT || '8080',
  requestTimeout: process.env.REQUEST_TIMEOUT || 10000,
  points: parseInt(process.env.RATE_LIMIT_POINTS || '10'),
  duration: parseInt(process.env.RATE_LIMIT_DURATION || '60'),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),

  /**
   * URLs for various microservices.
   * These URLs are used to route requests to the appropriate service.
   */
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:8081/',
  STUDENT_SERVICE_URL: process.env.STUDENT_SERVICE_URL || 'http://student-service:8082/',
  COURSE_SERVICE_URL: process.env.COURSE_SERVICE_URL || 'http://course-service:8083/',
  FACULTY_SERVICE_URL: process.env.FACULTY_SERVICE_URL || 'http://faculty-service:8084/',
  ENROLLMENT_SERVICE_URL: process.env.ENROLLMENT_SERVICE_URL || 'http://enrollment-service:8085/',

  KAFKA_URL: process.env.KAFKA_URL || 'kafka.ums.svc.cluster.local:9092',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'api-gateway',
  KAFKA_TOPIC: process.env.KAFKA_TOPIC || 'app-logs',
};