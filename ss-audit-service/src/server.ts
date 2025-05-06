import app from './app.js';
import { consumeAuditEvents } from './utils/kafkaConsumer.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

/**
 * The port number on which the server will listen for incoming connections.
 * This value is retrieved from the configuration and converted to a number.
 */
const port = Number(config.port);

/**
 * Starts the Audit Service by listening on the specified port and initializing
 * the Kafka consumer to process audit events.
 *
 * The server uses the `app` instance to handle incoming requests and listens
 * on the port specified in the configuration. Once the server starts, a log
 * message is generated to indicate that the service is running. Additionally,
 * the `consumeAuditEvents` function is invoked to begin consuming audit events
 * from the Kafka topic.
 *
 * @remarks
 * - The port number is retrieved from the configuration and converted to a number.
 * - The `consumeAuditEvents` function is responsible for handling Kafka messages.
 */
app.listen(port, () => {
    logger.info(`🚀 Audit Service listening on port ${port}`);
    consumeAuditEvents();
});