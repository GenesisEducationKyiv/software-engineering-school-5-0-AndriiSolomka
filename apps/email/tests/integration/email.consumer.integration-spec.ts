import { INestMicroservice } from '@nestjs/common';
import {
  ClientKafka,
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailToken } from 'apps/email/src/core/email.interface';
import { EMAIL_EVENTS } from 'libs/common/events/email';

describe('EmailConsumer Kafka Integration', () => {
  let app: INestMicroservice;
  let publisher: ClientKafka;
  let mockEmailService: { sendWeatherEmail: jest.Mock };

  beforeAll(async () => {
    mockEmailService = {
      sendWeatherEmail: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'KAFKA_PUBLISHER',
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['kafka-test:9092'],
                clientId: 'email-publisher-test',
              },
              producerOnlyMode: true,
            },
          },
        ]),
      ],
      providers: [
        {
          provide: EmailToken,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    app = moduleRef.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka-test:9092'],
          clientId: 'email-consumer-test',
        },
        consumer: {
          groupId: 'email-group-test',
        },
      },
    });

    publisher = moduleRef.get<ClientKafka>('KAFKA_PUBLISHER');

    await app.listen();
    await publisher.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
    await publisher.close();
  });

  it('should consume EMAIL_EVENTS.SENDED and call sendWeatherEmail', async () => {
    const payload = {
      email: 'integration@example.com',
      subject: 'Integration Test',
      text: 'Integration Body',
    };

    publisher.emit(EMAIL_EVENTS.SENDED, payload);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(mockEmailService.sendWeatherEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendWeatherEmail).toHaveBeenCalledWith(payload);
  });
});
