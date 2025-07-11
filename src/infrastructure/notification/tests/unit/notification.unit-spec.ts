import { Test } from '@nestjs/testing';
import { EmailConfig } from 'src/infrastructure/email/config/email.config';
import { EmailInterface } from 'src/infrastructure/email/core/email.interface';
import { EmailApiClient } from 'src/infrastructure/email/interface/clients/email.client';
import { NotificationService } from 'src/infrastructure/notification/infrastructure/services/notification.service';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { SubscriptionInterface } from 'src/infrastructure/subscription-management/core/subscription/subscription.interface';
import { SubscriptionApiClient } from 'src/infrastructure/subscription-management/interface/clients/application.client';
import {
  WeatherData,
  WeatherInterface,
} from 'src/infrastructure/weather/core/weather.interface';
import { WeatherApiClient } from 'src/infrastructure/weather/interfaces/client/weather.client';
import * as notificationBuilder from 'src/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';

jest.mock('src/utils/notification/notification-builder', () => ({
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
    frequency: Frequency.Daily,
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
          provide: SubscriptionApiClient,
          useValue: subClientMock,
        },
        {
          provide: WeatherApiClient,
          useValue: weatherClientMock,
        },
        {
          provide: EmailApiClient,
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

      await service.sendWeatherUpdates(Frequency.Daily);

      expect(subClientMock.getByFrequency).toHaveBeenCalledWith(
        Frequency.Daily,
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

      await service.sendWeatherUpdates(Frequency.Hourly);

      expect(subClientMock.getByFrequency).toHaveBeenCalledWith(
        Frequency.Hourly,
      );

      expect(weatherClientMock.getWeather).not.toHaveBeenCalled();
      expect(
        notificationBuilder.buildWeatherNotification,
      ).not.toHaveBeenCalled();
      expect(emailClientMock.sendWeatherEmail).not.toHaveBeenCalled();
    });
  });
});
