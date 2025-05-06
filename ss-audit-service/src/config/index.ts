import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuration object for the Audit Service.
 * This object contains various service URLs and the port on which the gateway runs.
 */
export const config = {
    port: process.env.PORT || '8086',
    KAFKA_URL: process.env.KAFKA_URL || 'kafka.ums.svc.cluster.local:9092',
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'audit-service',
    KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'audit-group',
    KAFKA_TOPIC: process.env.KAFKA_TOPIC || 'app-logs',
};