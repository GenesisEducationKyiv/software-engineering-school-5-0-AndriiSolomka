import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/email/src/app.module';
import { EmailKafkaConsumer } from 'apps/email/src/consumer/services/email.service';
import { Kafka, Producer } from 'kafkajs';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { scheduler } from 'node:timers/promises';

describe('Kafka Email Consumer (integration)', () => {
  let app: INestApplication;
  let kafka: Kafka;
  let producer: Producer;
  let handleSpy: jest.SpyInstance;

  beforeAll(async () => {
    handleSpy = jest
      .spyOn(EmailKafkaConsumer.prototype, 'handleEvent')
      .mockResolvedValue();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.startAllMicroservices();
    await app.init();

    kafka = new Kafka({
      clientId: 'test-client',
      brokers: ['kafka-test:9092'],
    });

    producer = kafka.producer({ allowAutoTopicCreation: true });
    await producer.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleEvent on Kafka message', async () => {
    const payload = {
      email: 'user@example.com',
      subject: 'Weather Update',
      text: 'Today is sunny!',
    };

    await producer.send({
      topic: EMAIL_EVENTS.SENDED,
      messages: [{ value: JSON.stringify(payload) }],
    });

    await scheduler.wait(300);

    expect(handleSpy).toHaveBeenCalledTimes(1);
    expect(handleSpy).toHaveBeenCalledWith(payload);
  });

  it('should NOT call handleEvent on a different Kafka topic', async () => {
    const payload = {
      email: 'user2@example.com',
      subject: 'Other Event',
      text: 'This should not trigger handleEvent',
    };

    await producer.send({
      topic: 'some-other-topic',
      messages: [{ value: JSON.stringify(payload) }],
    });

    await scheduler.wait(300);

    expect(handleSpy).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await producer.disconnect();
    await app.close();
    jest.restoreAllMocks();
  });
});
