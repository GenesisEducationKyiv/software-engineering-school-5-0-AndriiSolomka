import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/email/src/app.module';
import { EmailTransportToken } from 'apps/email/src/core/email-transport.interface';
import { EmailPayload } from 'apps/email/src/core/email.interface';
import { EmailKafkaController } from 'apps/email/src/interface/email.cafka.controller';
import { Kafka, Producer } from 'kafkajs';
import { scheduler } from 'node:timers/promises';

describe('Kafka Email Consumer (integration)', () => {
  let app: INestApplication;
  let controller: EmailKafkaController;
  let handleSpy: jest.SpyInstance;
  let kafka: Kafka;
  let producer: Producer;

  beforeAll(async () => {
    const transportMock = { send: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailTransportToken)
      .useValue(transportMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.startAllMicroservices();
    await app.init();

    controller = app.get(EmailKafkaController);
    handleSpy = jest.spyOn(controller, 'handleEmailSend');

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

  it('should call handleEmailSend directly', async () => {
    const payload: EmailPayload = {
      email: 'user@example.com',
      subject: 'Weather Update',
      text: 'Today is sunny!',
    };

    await controller.handleEmailSend(payload);

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
