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
import { PrismaModule } from './infrastructure/subscription-management/infrastructure/database/prisma.module';
import { SubscriptionManagementModule } from './infrastructure/subscription-management/subscription-management.module';
import { CacheWeatherModule } from './infrastructure/weather/infrastructure/cache/cache-weather.module';
import { InternalWeatherModule } from './infrastructure/weather/weather.module';
import { SubscriptionControllersModule } from './interface/modules/subscription-controllers.module';
import { WeatherControllersModule } from './interface/modules/weather-controller.module';
import { CacheModule } from './libs/infrastructure/cache/cache.module';
import { RedisModule } from './libs/infrastructure/cache/providers/redis.module';
import { CacheCityModule } from './libs/infrastructure/geocoding/cache/cache-city.module';
import { CacheCityService } from './libs/infrastructure/geocoding/cache/cache-city.service';
import { GeocodingModule } from './libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from './libs/infrastructure/http/http-client.module';
import { LoggerModule } from './libs/infrastructure/logger/logger.module';
import { MetricsModule } from './libs/infrastructure/metrics/metrics.module';

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
    InternalWeatherModule,
    InternalNotificationModule,
    SubscriptionManagementModule,
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
