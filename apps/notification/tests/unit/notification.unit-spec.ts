import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfig } from 'apps/notification/config/email.config';
import { NotificationInterface } from 'apps/notification/src/notification/core/notification.interface';
import { NotificationService } from 'apps/notification/src/notification/infrastructure/services/notification.service';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/notification/src/weather/infrastructure/weather.grpc.client';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { KafkaPublisherService } from 'libs/infrastructure/kafka/kafka.publisher';
import * as notificationBuilder from 'libs/utils/notification/notification-builder';

jest.mock('libs/utils/notification/notification-builder', () => ({
  buildWeatherNotification: jest.fn(),
}));

function makeSubscription(email = 'user@example.com', city = 'Kyiv') {
  return { email, city, tokens: [] };
}

function makeWeather() {
  return { temperature: 10, humidity: 50, description: 'Cloudy' };
}

describe('NotificationService (unit)', () => {
  let service: NotificationInterface;
  const mockSubService = { getByFrequency: jest.fn() };
  const mockWeatherService = { getWeather: jest.fn() };
  const mockKafkaPublisher = { emit: jest.fn() };
  const mockEmailConfig = { unsubscribeLink: 'http://unsubscribe' };

  beforeEach(async () => {
    (notificationBuilder.buildWeatherNotification as jest.Mock).mockReturnValue(
      {
        subject: 'Weather Update for City',
        text: 'Weather details...',
      },
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriptionClientService,
          useValue: mockSubService,
        },
        {
          provide: WeatherClientService,
          useValue: mockWeatherService,
        },
        {
          provide: KafkaPublisherService,
          useValue: mockKafkaPublisher,
        },
        {
          provide: EmailConfig,
          useValue: mockEmailConfig,
        },
        {
          provide: NotificationService,
          useClass: NotificationService,
        },
      ],
    }).compile();

    service = moduleRef.get<NotificationInterface>(NotificationService);

    jest.clearAllMocks();
  });

  it('should publish email notifications to all subscriptions', async () => {
    const subscriptions = [
      makeSubscription('user1@mail.com', 'Kyiv'),
      makeSubscription('user2@mail.com', 'Lviv'),
    ];
    const weather = makeWeather();

    mockSubService.getByFrequency.mockResolvedValue({ subscriptions });
    mockWeatherService.getWeather.mockResolvedValue(weather);

    await service.sendWeatherUpdates(Frequency.daily);

    expect(mockSubService.getByFrequency).toHaveBeenCalledWith(Frequency.daily);
    expect(mockWeatherService.getWeather).toHaveBeenCalledTimes(2);

    expect(
      notificationBuilder.buildWeatherNotification,
    ).toHaveBeenNthCalledWith(
      1,
      subscriptions[0],
      weather,
      mockEmailConfig.unsubscribeLink,
    );
    expect(
      notificationBuilder.buildWeatherNotification,
    ).toHaveBeenNthCalledWith(
      2,
      subscriptions[1],
      weather,
      mockEmailConfig.unsubscribeLink,
    );

    expect(mockKafkaPublisher.emit).toHaveBeenNthCalledWith(
      1,
      EMAIL_EVENTS.SENDED,
      {
        email: 'user1@mail.com',
        subject: 'Weather Update for City',
        text: 'Weather details...',
      },
    );
    expect(mockKafkaPublisher.emit).toHaveBeenNthCalledWith(
      2,
      EMAIL_EVENTS.SENDED,
      {
        email: 'user2@mail.com',
        subject: 'Weather Update for City',
        text: 'Weather details...',
      },
    );
  });

  it('should do nothing if no subscriptions returned', async () => {
    mockSubService.getByFrequency.mockResolvedValue({ subscriptions: [] });

    await service.sendWeatherUpdates(Frequency.daily);

    expect(mockSubService.getByFrequency).toHaveBeenCalledWith(Frequency.daily);
    expect(mockWeatherService.getWeather).not.toHaveBeenCalled();
    expect(notificationBuilder.buildWeatherNotification).not.toHaveBeenCalled();
    expect(mockKafkaPublisher.emit).not.toHaveBeenCalled();
  });
});
