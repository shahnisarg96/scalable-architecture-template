// audit/src/consumers/auditConsumer.ts
import { Kafka } from 'kafkajs';
import { logToFile } from './fileLogger.js';
import { config } from '../config/index.js';
import { ensureTopics } from './kafkaAdmin.js';

const kafka = new Kafka({
    clientId: config.KAFKA_CLIENT_ID,
    brokers: [config.KAFKA_URL],
    connectionTimeout: 3000,
    requestTimeout: 30000,
});
const consumer = kafka.consumer({
    groupId: config.KAFKA_GROUP_ID,
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
});

export async function consumeAuditEvents() {
    await ensureTopics();
    await consumer.connect();
    await consumer.subscribe({
        topic: config.KAFKA_TOPIC,
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const payload = message.value?.toString();
            const logEntry = `[${new Date().toISOString()}] ${topic}[${partition}]: ${payload}`;
            console.log('Received:', logEntry);
            logToFile(logEntry);
        },
    });
}
