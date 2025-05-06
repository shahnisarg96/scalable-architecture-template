// gateway/src/logging/KafkaTransport.ts
import Transport from 'winston-transport';
import { Kafka } from 'kafkajs';
import { config } from '../config/index.js';
import { ensureTopics } from './kafkaAdmin.js';

const kafka = new Kafka({
    clientId: config.KAFKA_CLIENT_ID,
    brokers: [config.KAFKA_URL],
});
const producer = kafka.producer();

await ensureTopics();      // ← auto-create before connect
await producer.connect();

export class KafkaTransport extends Transport {
    topic: string;
    constructor(opts: any) {
        super(opts);
        this.topic = opts.topic || config.KAFKA_TOPIC;
    }

    async log(info: any, callback: () => void) {
        setImmediate(() => this.emit('logged', info));
        try {
            await producer.send({
                topic: this.topic,
                messages: [{ value: JSON.stringify(info) }],
            });
        } catch (err) {
            console.error('Failed to log to Kafka:', err);
        }
        callback();
    }
}
