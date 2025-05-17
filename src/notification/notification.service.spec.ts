import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { WeatherService } from 'src/weather/weather.service';
import { EmailService } from 'src/email/email.service';
import { Frequency } from '@prisma/client';
import { buildWeatherNotification } from 'src/utils/notification/notification-builder';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
/* eslint-disable @typescript-eslint/unbound-method */

jest.mock('src/utils/notification/notification-builder', () => ({
  buildWeatherNotification: jest.fn(),
}));

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let subscriptionService: jest.Mocked<SubscriptionService>;
  let weatherService: jest.Mocked<WeatherService>;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SubscriptionService,
          useValue: {
            getByFrequency: jest.fn(),
          },
        },
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendWeatherEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    subscriptionService = module.get(SubscriptionService);
    weatherService = module.get(WeatherService);
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });

  describe('sendWeatherUpdates', () => {
    it('should send weather updates to all subscriptions with given frequency', async () => {
      const frequency = Frequency.daily;

      const mockSubscriptions = [
        {
          subscription_id: 1,
          email: 'user1@example.com',
          city: 'Paris',
          frequency,
          confirmed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tokens: [
            {
              subscription_id: 1,
              createdAt: new Date(),
              token: 'token1',
              token_id: 1,
              expiresAt: null,
            },
          ],
        },
        {
          subscription_id: 2,
          email: 'user2@example.com',
          city: 'Tokyo',
          frequency,
          confirmed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tokens: [
            {
              subscription_id: 2,
              createdAt: new Date(),
              token: 'token2',
              token_id: 2,
              expiresAt: null,
            },
          ],
        },
      ];

      const mockWeather: CreateWeatherDto = {
        temperature: 25,
        description: 'Sunny',
        humidity: 50,
      };

      const mockNotification = {
        subject: 'Weather Update',
        text: 'It is sunny and 25°C in Paris.',
      };

      subscriptionService.getByFrequency.mockResolvedValue(mockSubscriptions);
      weatherService.getWeather.mockResolvedValue(mockWeather);
      (buildWeatherNotification as jest.Mock).mockReturnValue(mockNotification);

      await notificationService.sendWeatherUpdates(frequency);

      expect(subscriptionService.getByFrequency).toHaveBeenCalledWith(
        frequency,
      );

      for (const sub of mockSubscriptions) {
        expect(weatherService.getWeather).toHaveBeenCalledWith(sub.city);
        expect(buildWeatherNotification).toHaveBeenCalledWith(sub, mockWeather);
        expect(emailService.sendWeatherEmail).toHaveBeenCalledWith({
          email: sub.email,
          subject: mockNotification.subject,
          text: mockNotification.text,
        });
      }
    });

    it('should not throw when there are no subscriptions', async () => {
      subscriptionService.getByFrequency.mockResolvedValue([]);

      await expect(
        notificationService.sendWeatherUpdates(Frequency.daily),
      ).resolves.not.toThrow();

      expect(weatherService.getWeather).not.toHaveBeenCalled();
      expect(emailService.sendWeatherEmail).not.toHaveBeenCalled();
    });
  });
});
