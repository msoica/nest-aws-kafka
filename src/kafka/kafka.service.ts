import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { KafkaClient, GetBootstrapBrokersCommand } from '@aws-sdk/client-kafka';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private client: KafkaClient;

  constructor() {
    this.client = new KafkaClient({ region: 'your-aws-region' }); // Replace with your AWS region
  }

  async onModuleInit() {
    const brokers = await this.getBrokers();
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka-client',
      brokers,
      ssl: {
        rejectUnauthorized: true,
        ca: [fs.readFileSync(path.join(__dirname, '../certs/ca.pem'), 'utf-8')],
        key: fs.readFileSync(path.join(__dirname, '../certs/service.key'), 'utf-8'),
        cert: fs.readFileSync(path.join(__dirname, '../certs/service.cert'), 'utf-8'),
      },
      sasl: {
        mechanism: 'plain', // Replace with your SASL mechanism
        username: 'your-username', // Replace with your AWS Kafka username
        password: 'your-password', // Replace with your AWS Kafka password
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-group' });

    await this.producer.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  private async getBrokers(): Promise<string[]> {
    const command = new GetBootstrapBrokersCommand({ ClusterArn: 'your-cluster-arn' }); // Replace with your cluster ARN
    const response = await this.client.send(command);
    return response.BootstrapBrokerStringTls.split(',');
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consumeMessages(topic: string) {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
      },
    });
  }
}
