import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { ConfigifyModule } from '@itgorillaz/configify';
import { MetricsModule } from './application/modules/metrics.module';
import { LoggerModule } from './application/modules/logger.module';
import { HttpClientModule } from './application/modules/http-client.module';
import { WeatherModule } from './application/modules/weather.module';
import { PrismaModule } from './application/modules/prisma.module';
import { RedisModule } from './application/modules/redis.module';
import { EmailModule } from './application/modules/email.module';
import { TokenModule } from './application/modules/token.module';
import { SubscriptionDomainModule } from './application/modules/subscription-domain.module';
import { SubscriptionHandlersModule } from './application/modules/subscription-handlers.module';
import { ScheduleModule } from './application/modules/schedule.module';
import { NotificationModule } from './application/modules/notification.module';
import { CacheWeatherModule } from './application/modules/cache-weather.module';
import { CacheCityModule } from './application/modules/cache-city.module';
import { CacheModule } from './application/modules/cache.module';
import { NodemailerModule } from './application/modules/nodemailer.module';
import { WeatherProviderModule } from './application/modules/weather-provider.module';
import { GeocodingModule } from './application/modules/geocoding.module';
import { CacheCityService } from './infrastructure/cache/cache-city.service';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';

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
