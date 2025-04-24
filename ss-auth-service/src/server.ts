import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

/**
 * The port number on which the server will listen for incoming requests.
 * It is parsed as a number from the configuration settings.
 */
const port = Number(config.port);

/**
 * Starts the authentication service by listening on the specified port.
 * 
 * The port number is retrieved from the configuration and parsed as a number.
 * Once the server starts successfully, a log message is generated to indicate
 * that the service is running and listening for incoming requests.
 * 
 * @remarks
 * This is the entry point for the authentication service, responsible for
 * initializing the server and binding it to the configured port.
 * 
 */
app.listen(port, () => {
    logger.info(`🚀 Auth Service listening on port ${port}`);
});