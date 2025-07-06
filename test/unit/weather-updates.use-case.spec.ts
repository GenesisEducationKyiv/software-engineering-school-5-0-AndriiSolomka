import { Test } from '@nestjs/testing';
import { EmailConfig } from 'src/config/email.config';
import {
  EmailInterface,
  EmailToken,
} from 'src/core/abstracts/email/email.interface';
import {
  SubscriptionInterface,
  SubscriptionToken,
} from 'src/core/abstracts/subscription/subscription.interface';
import {
  WeatherData,
  WeatherInterface,
  WeatherToken,
} from 'src/core/abstracts/weather/weather.interface';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/entities/subscription.entity';
import { SendWeatherUpdatesUseCase } from 'src/use-cases/weather-updates/weather-updates.use-case';
import * as notificationBuilder from 'src/utils/notification/notification-builder';

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
  let useCase: SendWeatherUpdatesUseCase;
  let subServiceMock: jest.Mocked<
    Pick<SubscriptionInterface, 'getByFrequency'>
  >;
  let weatherServiceMock: jest.Mocked<Pick<WeatherInterface, 'getWeather'>>;
  let emailServiceMock: jest.Mocked<Pick<EmailInterface, 'sendWeatherEmail'>>;
  let emailConfig: EmailConfig;

  beforeEach(async () => {
    subServiceMock = {
      getByFrequency: jest.fn(),
    };

    weatherServiceMock = {
      getWeather: jest.fn(),
    };

    emailServiceMock = {
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
        SendWeatherUpdatesUseCase,
        {
          provide: SubscriptionToken,
          useValue: subServiceMock,
        },
        {
          provide: WeatherToken,
          useValue: weatherServiceMock,
        },
        {
          provide: EmailToken,
          useValue: emailServiceMock,
        },
        {
          provide: EmailConfig,
          useValue: emailConfig,
        },
      ],
    }).compile();

    useCase = module.get<SendWeatherUpdatesUseCase>(SendWeatherUpdatesUseCase);
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

      subServiceMock.getByFrequency.mockResolvedValue(subscriptions);
      weatherServiceMock.getWeather.mockResolvedValue(weather);
      emailServiceMock.sendWeatherEmail.mockResolvedValue(undefined);

      await useCase.sendWeatherUpdates(Frequency.Daily);

      expect(subServiceMock.getByFrequency).toHaveBeenCalledWith(
        Frequency.Daily,
      );

      expect(weatherServiceMock.getWeather).toHaveBeenCalledTimes(2);
      expect(weatherServiceMock.getWeather).toHaveBeenNthCalledWith(1, 'Kyiv');
      expect(weatherServiceMock.getWeather).toHaveBeenNthCalledWith(
        2,
        'London',
      );

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

      expect(emailServiceMock.sendWeatherEmail).toHaveBeenCalledTimes(2);
      expect(emailServiceMock.sendWeatherEmail).toHaveBeenNthCalledWith(1, {
        email: 'user1@example.com',
        subject: 'Weather Update for Kyiv',
        text: 'Today in Kyiv: Sunny, 20°C',
      });
      expect(emailServiceMock.sendWeatherEmail).toHaveBeenNthCalledWith(2, {
        email: 'user2@example.com',
        subject: 'Weather Update for Kyiv',
        text: 'Today in Kyiv: Sunny, 20°C',
      });
    });

    it('should not send any emails if there are no subscriptions with matching frequency', async () => {
      subServiceMock.getByFrequency.mockResolvedValue([]);

      await useCase.sendWeatherUpdates(Frequency.Hourly);

      expect(subServiceMock.getByFrequency).toHaveBeenCalledWith(
        Frequency.Hourly,
      );

      expect(weatherServiceMock.getWeather).not.toHaveBeenCalled();
      expect(
        notificationBuilder.buildWeatherNotification,
      ).not.toHaveBeenCalled();
      expect(emailServiceMock.sendWeatherEmail).not.toHaveBeenCalled();
    });
  });
});
