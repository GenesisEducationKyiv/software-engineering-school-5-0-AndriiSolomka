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
import { GeocodingModule } from './infrastructure/libs/geocoding/geocoding.module';
import { HttpClientModule } from './infrastructure/libs/http/http-client.module';
import { LoggerModule } from './infrastructure/libs/logger/logger.module';
import { MetricsModule } from './infrastructure/libs/metrics/metrics.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { CacheCityService } from './infrastructure/cache/cache-city.service';
import { InternalEmailModule } from './infrastructure/email/email.module';
import { InternalSubscriptionModule } from './infrastructure/subscription-management/subscription/subscription.module';
import { InternalTokenModule } from './infrastructure/subscription-management/token/token.module';
import { InternalWeatherModule } from './infrastructure/weather/weather.module';
import { SubscriptionControllersModule } from './interface/modules/subscription-controllers.module';
import { WeatherControllersModule } from './interface/modules/weather-controller.module';
import { InternalNotificationModule } from './infrastructure/notification/notification.module';
import { PrismaModule } from './infrastructure/subscription-management/infrastructure/database/prisma.module';
import { InternalHandlerModule } from './infrastructure/subscription-management/application/handlers.module';
import { RedisModule } from './infrastructure/libs/redis/redis.module';
import { CacheModule } from './infrastructure/libs/cache/cache.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    MetricsModule,
    LoggerModule,
    HttpClientModule,
    InternalWeatherModule,
    PrismaModule,
    RedisModule,
    LoggerModule,
    ScheduleNestModule.forRoot(),
    CacheWeatherModule,
    CacheCityModule,
    CacheModule,
    GeocodingModule,
    SubscriptionControllersModule,
    WeatherControllersModule,
    InternalEmailModule,
    InternalSubscriptionModule,
    InternalTokenModule,
    InternalWeatherModule,
    InternalNotificationModule,

    InternalHandlerModule,
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
