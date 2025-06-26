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
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import { SubscriptionDomainModule } from './subscription-domain/subscription-domain.module';
import { SubscriptionHandlersModule } from './subscription-handlers/subscription-handlers.module';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';
import { ScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from './notification/notification.module';
import { CacheWeatherModule } from './cache-weather/cache-weather.module';
import { CacheCityService } from './cache-city/cache-city.service';
import { CacheCityModule } from './cache-city/cache-city.module';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';
import { CacheModule } from './cache/cache.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { WeatherProviderModule } from './providers/weather/weather-provider.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import config from './config';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema,
    }),
    LoggerModule,
    FetchModule,
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
