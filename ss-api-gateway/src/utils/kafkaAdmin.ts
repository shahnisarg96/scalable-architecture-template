// shared/src/kafkaAdmin.ts
import { Kafka } from 'kafkajs';
import { config } from '../config/index.js';

export async function ensureTopics() {
    const kafka = new Kafka({
        clientId: config.KAFKA_CLIENT_ID,
        brokers: [config.KAFKA_URL],
    });

    const admin = kafka.admin();
    await admin.connect();

    // 1) List all topics (safe, won’t throw)
    const existing = await admin.listTopics();
    if (!existing.includes(config.KAFKA_TOPIC)) {
        console.info(`Topic "${config.KAFKA_TOPIC}" not found—creating it…`);
        const created = await admin.createTopics({
            topics: [{
                topic: config.KAFKA_TOPIC,
                numPartitions: 3,
                replicationFactor: 1,  // <= your broker count
            }],
            waitForLeaders: true,
        });
        if (!created) {
            console.error(`Failed to create topic "${config.KAFKA_TOPIC}".`);
            // you can throw here to fail-fast
            throw new Error(`Topic creation failed`);
        }
        console.info(`✔ Topic "${config.KAFKA_TOPIC}" created.`);
    } else {
        // 2) If it does exist, double-check that each partition has a leader
        const { topics } = await admin.fetchTopicMetadata({ topics: [config.KAFKA_TOPIC] });
        const bad = topics[0].partitions.filter(p => p.leader === -1);
        if (bad.length > 0) {
            console.warn(`Topic "${config.KAFKA_TOPIC}" has unassigned partitions`);
            // you might want to wait/retry or throw here
        } else {
            console.info(`✔ Topic "${config.KAFKA_TOPIC}" is healthy.`);
        }
    }

    await admin.disconnect();
}
