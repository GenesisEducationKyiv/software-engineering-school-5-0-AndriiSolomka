import { Test } from '@nestjs/testing';
import { EmailClientService } from 'apps/gateway/src/email/infrastructure/email.grcp.client';
import { SubscriptionClientService } from 'apps/gateway/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/gateway/src/weather/infrastructure/weather.grpc.client';
import { EmailConfig } from 'apps/notification/config/email.config';
import { EmailInterface } from 'apps/notification/src/core/email.interface';
import { NotificationInterface } from 'apps/notification/src/core/notification.interface';
import {
  Frequency,
  SubscriptionInterface,
} from 'apps/notification/src/core/subscription.interface';
import {
  WeatherData,
  WeatherInterface,
} from 'apps/notification/src/core/weather.interface';
import { NotificationService } from 'apps/notification/src/infrastructure/services/notification.service';
import * as notificationBuilder from 'libs/utils/notification/notification-builder';

jest.mock('libs/utils/notification/notification-builder', () => ({
  buildWeatherNotification: jest.fn(),
}));

function makeSubscription(
  id = 1,
  city = 'Kyiv',
  email = 'test@example.com',
): SubscriptionEntity {
  const now = new Date();
  return {
    subscriptionId: id,
    email: email,
    city: city,
    frequency: Frequency.daily,
    confirmed: true,
    createdAt: now,
    updatedAt: now,
    tokens: [],
  };
}

function makeWeather(): WeatherData {
  return {
    temperature: 20,
    humidity: 75,
    description: 'Sunny',
  };
}

describe('SendWeatherUpdatesUseCase', () => {
  let service: NotificationInterface;
  let subClientMock: jest.Mocked<Pick<SubscriptionInterface, 'getByFrequency'>>;
  let weatherClientMock: jest.Mocked<Pick<WeatherInterface, 'getWeather'>>;
  let emailClientMock: jest.Mocked<Pick<EmailInterface, 'sendWeatherEmail'>>;
  let emailConfig: EmailConfig;

  beforeEach(async () => {
    subClientMock = {
      getByFrequency: jest.fn(),
    };

    weatherClientMock = {
      getWeather: jest.fn(),
    };

    emailClientMock = {
      sendWeatherEmail: jest.fn(),
    };

    emailConfig = {
      unsubscribeLink: 'http://example.com/unsubscribe',
      confirmLink: 'http://example.com/confirm',
      user: 'test@example.com',
      password: 'password',
      service: 'gmail',
    };

    (notificationBuilder.buildWeatherNotification as jest.Mock).mockReturnValue(
      {
        subject: 'Weather Update for Kyiv',
        text: 'Today in Kyiv: Sunny, 20°C',
      },
    );

    const module = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SubscriptionClientService,
          useValue: subClientMock,
        },
        {
          provide: WeatherClientService,
          useValue: weatherClientMock,
        },
        {
          provide: EmailClientService,
          useValue: emailClientMock,
        },
        {
          provide: EmailConfig,
          useValue: emailConfig,
        },
      ],
    }).compile();

    service = module.get<NotificationInterface>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWeatherUpdates', () => {
    it('should send weather updates for all subscriptions with matching frequency', async () => {
      const subscriptions = [
        makeSubscription(1, 'Kyiv', 'user1@example.com'),
        makeSubscription(2, 'London', 'user2@example.com'),
      ];
      const weather = makeWeather();

      subClientMock.getByFrequency.mockResolvedValue(subscriptions);
      weatherClientMock.getWeather.mockResolvedValue(weather);
      emailClientMock.sendWeatherEmail.mockResolvedValue(undefined);

      await service.sendWeatherUpdates(Frequency.daily);

      expect(subClientMock.getByFrequency).toHaveBeenCalledWith(
        Frequency.daily,
      );

      expect(weatherClientMock.getWeather).toHaveBeenCalledTimes(2);
      expect(weatherClientMock.getWeather).toHaveBeenNthCalledWith(1, 'Kyiv');
      expect(weatherClientMock.getWeather).toHaveBeenNthCalledWith(2, 'London');

      expect(
        notificationBuilder.buildWeatherNotification,
      ).toHaveBeenCalledTimes(2);
      expect(
        notificationBuilder.buildWeatherNotification,
      ).toHaveBeenNthCalledWith(
        1,
        subscriptions[0],
        weather,
        emailConfig.unsubscribeLink,
      );
      expect(
        notificationBuilder.buildWeatherNotification,
      ).toHaveBeenNthCalledWith(
        2,
        subscriptions[1],
        weather,
        emailConfig.unsubscribeLink,
      );

      expect(emailClientMock.sendWeatherEmail).toHaveBeenCalledTimes(2);
      expect(emailClientMock.sendWeatherEmail).toHaveBeenNthCalledWith(1, {
        email: 'user1@example.com',
        subject: 'Weather Update for Kyiv',
        text: 'Today in Kyiv: Sunny, 20°C',
      });
      expect(emailClientMock.sendWeatherEmail).toHaveBeenNthCalledWith(2, {
        email: 'user2@example.com',
        subject: 'Weather Update for Kyiv',
        text: 'Today in Kyiv: Sunny, 20°C',
      });
    });

    it('should not send any emails if there are no subscriptions with matching frequency', async () => {
      subClientMock.getByFrequency.mockResolvedValue([]);

      await service.sendWeatherUpdates(Frequency.hourly);

      expect(subClientMock.getByFrequency).toHaveBeenCalledWith(
        Frequency.hourly,
      );

      expect(weatherClientMock.getWeather).not.toHaveBeenCalled();
      expect(
        notificationBuilder.buildWeatherNotification,
      ).not.toHaveBeenCalled();
      expect(emailClientMock.sendWeatherEmail).not.toHaveBeenCalled();
    });
  });
});
