import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { FetchModule } from './fetch/fetch.module';
import { WeatherModule } from './weather/weather.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WeatherApiClientModule } from './weather-api-client/weather-api-client.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';
import { ScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from './notification/notification.module';
import { CityModule } from './city/city.module';
import { CacheWeatherModule } from './cache-weather/cache-weather.module';
import { CacheCityService } from './cache-city/cache-city.service';
import { CacheCityModule } from './cache-city/cache-city.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';

@Module({
  imports: [
    LoggerModule,
    FetchModule,
    WeatherModule,
    PrismaModule,
    WeatherApiClientModule,
    RedisModule,
    EmailModule,
    LoggerModule,
    TokenModule,
    SubscriptionModule,
    SubscribeModule,
    ScheduleModule,
    NotificationModule,
    ScheduleNestModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CityModule,
    CacheWeatherModule,
    CacheCityModule,
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
