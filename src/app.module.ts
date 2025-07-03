import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { ConfigifyModule } from '@itgorillaz/configify';
import { MetricsModule } from './application/modules/infrastructure/metrics.module';
import { LoggerModule } from './application/modules/infrastructure/logger.module';
import { WeatherModule } from './application/modules/weather/weather.module';

import { TokenModule } from './application/modules/token/token.module';
import { SubscriptionDomainModule } from './application/modules/subscription/subscription-domain.module';
import { SubscriptionHandlersModule } from './application/modules/subscription/subscription-handlers.module';
import { ScheduleModule } from './application/modules/notification/schedule.module';

import { NodemailerModule } from './application/modules/notification/nodemailer.module';
import { WeatherProviderModule } from './application/modules/weather/weather-provider.module';
import { GeocodingModule } from './application/modules/infrastructure/geocoding.module';
import { CacheCityService } from './infrastructure/cache/cache-city.service';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';
import { HttpClientModule } from './application/modules/infrastructure/http-client.module';
import { PrismaModule } from './application/modules/infrastructure/prisma.module';
import { RedisModule } from './application/modules/cache/redis.module';
import { EmailModule } from './application/modules/notification/email.module';
import { NotificationModule } from './application/modules/notification/notification.module';
import { CacheWeatherModule } from './application/modules/cache/cache-weather.module';
import { CacheCityModule } from './application/modules/cache/cache-city.module';
import { CacheModule } from './application/modules/cache/cache.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    MetricsModule,
    LoggerModule,
    HttpClientModule,
    WeatherModule,
    PrismaModule,
    RedisModule,
    EmailModule,
    LoggerModule,
    TokenModule,
    SubscriptionDomainModule,
    SubscriptionHandlersModule,
    ScheduleModule,
    NotificationModule,
    ScheduleNestModule.forRoot(),
    CacheWeatherModule,
    CacheCityModule,
    CacheModule,
    NodemailerModule,
    WeatherProviderModule,
    GeocodingModule,
  ],
  controllers: [],
  providers: [CacheCityService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes({ path: '/*api', method: RequestMethod.ALL });
  }
}
