import { Controller, Get, Post, Body } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';

@Controller()
export class AppController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('send')
  async sendMessage(@Body('message') message: string) {
    await this.kafkaService.sendMessage('your-topic', message);
    return 'Message sent';
  }

  @Get('consume')
  async consumeMessages() {
    await this.kafkaService.consumeMessages('your-topic');
    return 'Consuming messages';
  }
}
