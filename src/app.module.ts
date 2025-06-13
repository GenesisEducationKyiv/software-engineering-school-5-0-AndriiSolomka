import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { FetchModule } from './fetch/fetch.module';
import { WeatherHandlersModule } from './weather-handlers/weather-handlers.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WeatherDomainModule } from './weather-domain/weather-domain.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import { SubscriptionDomainModule } from './subscription-domain/subscription-domain.module';
import { SubscriptionHandlersModule } from './subscription-handlers/subscription-handlers.module';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';
import { ScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from './notification/notification.module';
import { CityModule } from './city/city.module';
import { CacheWeatherModule } from './cache-weather/cache-weather.module';
import { CacheCityService } from './cache-city/cache-city.service';
import { CacheCityModule } from './cache-city/cache-city.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { CacheModule } from './cache/cache.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';

@Module({
  imports: [
    LoggerModule,
    FetchModule,
    WeatherHandlersModule,
    PrismaModule,
    WeatherDomainModule,
    RedisModule,
    EmailModule,
    LoggerModule,
    TokenModule,
    SubscriptionDomainModule,
    SubscriptionHandlersModule,
    ScheduleModule,
    NotificationModule,
    ScheduleNestModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CityModule,
    CacheWeatherModule,
    CacheCityModule,
    CacheModule,
    NodemailerModule,
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
