import { Test, TestingModule } from '@nestjs/testing';
import * as notificationBuilder from '@weather-utils/core';
import { EmailConfig } from 'apps/notification/config/email.config';
import { NotificationInterface } from 'apps/notification/src/notification/core/notification.interface';
import { EmailPublisher } from 'apps/notification/src/notification/infrastructure/publisher/email.publisher';
import { NotificationService } from 'apps/notification/src/notification/infrastructure/services/notification.service';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/notification/src/weather/infrastructure/weather.grpc.client';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';

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
  const mockEmailPublisher = { publishEmail: jest.fn() };
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
          provide: EmailPublisher,
          useValue: mockEmailPublisher,
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

    expect(mockEmailPublisher.publishEmail).toHaveBeenNthCalledWith(
      1,
      'user1@mail.com',
      'Weather Update for City',
      'Weather details...',
    );
    expect(mockEmailPublisher.publishEmail).toHaveBeenNthCalledWith(
      2,
      'user2@mail.com',
      'Weather Update for City',
      'Weather details...',
    );
  });

  it('should do nothing if no subscriptions returned', async () => {
    mockSubService.getByFrequency.mockResolvedValue({ subscriptions: [] });

    await service.sendWeatherUpdates(Frequency.daily);

    expect(mockSubService.getByFrequency).toHaveBeenCalledWith(Frequency.daily);
    expect(mockWeatherService.getWeather).not.toHaveBeenCalled();
    expect(notificationBuilder.buildWeatherNotification).not.toHaveBeenCalled();
    expect(mockEmailPublisher.publishEmail).not.toHaveBeenCalled();
  });
});
