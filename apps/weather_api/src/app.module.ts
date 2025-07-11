import { ConfigifyModule } from '@itgorillaz/configify';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';
import { InternalEmailModule } from 'apps/email/email.module';
import { InternalNotificationModule } from 'apps/notification/src/notification.module';
import { CacheWeatherModule } from 'apps/weather/src/infrastructure/cache/cache-weather.module';
import { HttpLoggerMiddleware } from 'common/middlewares/http-logger.middleware';
import { CacheModule } from 'libs/infrastructure/cache/cache.module';
import { RedisModule } from 'libs/infrastructure/cache/providers/redis.module';
import { CacheCityModule } from 'libs/infrastructure/geocoding/cache/cache-city.module';
import { CacheCityService } from 'libs/infrastructure/geocoding/cache/cache-city.service';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';
import { MetricsModule } from 'libs/infrastructure/metrics/metrics.module';

import { SubscriptionControllersModule } from '../../gateway/src/modules/subscription-controllers.module';
import { WeatherControllersModule } from '../../gateway/src/modules/weather-controller.module';
import { PrismaModule } from '../../subscription/src/infrastructure/database/prisma.module';
import { SubscriptionManagementModule } from '../../subscription/src/subscription.module';
import { WeatherAppModule } from '../../weather/src/weather.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    MetricsModule,
    LoggerModule,
    HttpClientModule,
    AppModule,
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
    InternalNotificationModule,
    SubscriptionManagementModule,
    WeatherAppModule,
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
