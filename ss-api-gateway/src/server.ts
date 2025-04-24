import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

/**
 * The port number on which the server will listen for incoming requests.
 * It is parsed as a number from the configuration settings.
 */
const port = Number(config.port);

/**
 * Starts the API Gateway server and listens for incoming requests on the specified port.
 * The port number is retrieved from the configuration settings and parsed as a number.
 *
 * @remarks
 * This script initializes the server by importing the application instance (`app`) 
 * and configuration settings (`config`). It then starts the server on the configured port.
 *
 */
app.listen(port, () => {
  logger.info(`🚀 API Gateway listening on port ${port}`);
});