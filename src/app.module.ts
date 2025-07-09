import { ConfigifyModule } from '@itgorillaz/configify';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';

import { CacheCityModule } from './application/modules/cache/cache-city.module';
import { CacheWeatherModule } from './application/modules/cache/cache-weather.module';
import { CacheModule } from './application/modules/cache/cache.module';
import { RedisModule } from './application/modules/cache/redis.module';
import { GeocodingModule } from './application/modules/infrastructure/geocoding.module';
import { HttpClientModule } from './application/modules/infrastructure/http-client.module';
import { LoggerModule } from './application/modules/infrastructure/logger.module';
import { MetricsModule } from './application/modules/infrastructure/metrics.module';
import { PrismaModule } from './application/modules/infrastructure/prisma.module';
import { ScheduleModule } from './application/modules/notification/schedule.module';
import { WeatherUpdatesModule } from './application/modules/notification/weather-updates.module';
import { SubscriptionDomainModule } from './application/modules/subscription/subscription-domain.module';
import { TokenModule } from './application/modules/token/token.module';
import { WeatherProviderModule } from './application/modules/weather/weather-provider.module';
import { WeatherModule } from './application/modules/weather/weather.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { InternalSubscriptionModule } from './infrastructure/api/modules/subscription/subscription.module';
import { CacheCityService } from './infrastructure/cache/cache-city.service';
import { InternalEmailModule } from './infrastructure/email/email.module';
import { SubscriptionControllersModule } from './interface/modules/subscription-controllers.module';
import { WeatherControllersModule } from './interface/modules/weather-controller.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    MetricsModule,
    LoggerModule,
    HttpClientModule,
    WeatherModule,
    PrismaModule,
    RedisModule,
    LoggerModule,
    TokenModule,
    SubscriptionDomainModule,
    ScheduleModule,
    WeatherUpdatesModule,
    ScheduleNestModule.forRoot(),
    CacheWeatherModule,
    CacheCityModule,
    CacheModule,
    WeatherProviderModule,
    GeocodingModule,
    SubscriptionControllersModule,
    WeatherControllersModule,
    InternalEmailModule,
    InternalSubscriptionModule,
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
