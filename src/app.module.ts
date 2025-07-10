import { ConfigifyModule } from '@itgorillaz/configify';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';

import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { InternalEmailModule } from './infrastructure/email/email.module';
import { InternalNotificationModule } from './infrastructure/notification/notification.module';
import { InternalHandlerModule } from './infrastructure/subscription-management/application/handlers.module';
import { PrismaModule } from './infrastructure/subscription-management/infrastructure/database/prisma.module';
import { InternalSubscriptionModule } from './infrastructure/subscription-management/subscription/subscription.module';
import { InternalTokenModule } from './infrastructure/subscription-management/token/token.module';
import { CacheWeatherModule } from './infrastructure/weather/cache/cache-weather.module';
import { InternalWeatherModule } from './infrastructure/weather/weather.module';
import { SubscriptionControllersModule } from './interface/modules/subscription-controllers.module';
import { WeatherControllersModule } from './interface/modules/weather-controller.module';
import { CacheModule } from './libs/cache/cache.module';
import { CacheCityModule } from './libs/geocoding/cache/cache-city.module';
import { CacheCityService } from './libs/geocoding/cache/cache-city.service';
import { GeocodingModule } from './libs/geocoding/geocoding.module';
import { HttpClientModule } from './libs/http/http-client.module';
import { LoggerModule } from './libs/logger/logger.module';
import { MetricsModule } from './libs/metrics/metrics.module';
import { RedisModule } from './libs/redis/redis.module';

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
