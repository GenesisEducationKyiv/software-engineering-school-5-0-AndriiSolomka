import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfig } from 'apps/notification/config/email.config';
import { EmailClientService } from 'apps/notification/src/email/infrastructure/email.grpc.client';
import { NotificationInterface } from 'apps/notification/src/notification/core/notification.interface';
import { NotificationService } from 'apps/notification/src/notification/infrastructure/services/notification.service';
import { Frequency } from 'apps/notification/src/subscription/core/subscription.interface';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/notification/src/weather/infrastructure/weather.grpc.client';
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
  const mockEmailService = { sendWeatherEmail: jest.fn() };
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
          provide: EmailClientService,
          useValue: mockEmailService,
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

  it('should send weather updates to all subscriptions and use notificationBuilder', async () => {
    const subscriptions = [
      makeSubscription('user1@mail.com', 'Kyiv'),
      makeSubscription('user2@mail.com', 'Lviv'),
    ];
    const weather = makeWeather();

    mockSubService.getByFrequency.mockResolvedValue(subscriptions);
    mockWeatherService.getWeather.mockResolvedValue(weather);

    await service.sendWeatherUpdates(Frequency.daily);

    expect(mockSubService.getByFrequency).toHaveBeenCalledWith(Frequency.daily);
    expect(mockWeatherService.getWeather).toHaveBeenCalledTimes(2);

    expect(notificationBuilder.buildWeatherNotification).toHaveBeenCalledTimes(
      2,
    );
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

    expect(mockEmailService.sendWeatherEmail).toHaveBeenCalledTimes(2);
    expect(mockEmailService.sendWeatherEmail).toHaveBeenNthCalledWith(1, {
      email: 'user1@mail.com',
      subject: 'Weather Update for City',
      text: 'Weather details...',
    });
    expect(mockEmailService.sendWeatherEmail).toHaveBeenNthCalledWith(2, {
      email: 'user2@mail.com',
      subject: 'Weather Update for City',
      text: 'Weather details...',
    });
  });

  it('should not send any emails if there are no subscriptions', async () => {
    mockSubService.getByFrequency.mockResolvedValue([]);

    await service.sendWeatherUpdates(Frequency.daily);

    expect(mockSubService.getByFrequency).toHaveBeenCalledWith(Frequency.daily);
    expect(mockWeatherService.getWeather).not.toHaveBeenCalled();
    expect(notificationBuilder.buildWeatherNotification).not.toHaveBeenCalled();
    expect(mockEmailService.sendWeatherEmail).not.toHaveBeenCalled();
  });
});
