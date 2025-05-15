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
import { HttpLoggerService } from './logger/http-logger.service';
import { CacheModule } from './cache/cache.module';
import { TokenModule } from './token/token.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { ScheduleModule as ScheduleNestModule } from '@nestjs/schedule';
import { ScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from './notification/notification.module';
import { CityModule } from './city/city.module';

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
    CacheModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerService)
      .forRoutes({ path: '/*api', method: RequestMethod.ALL });
  }
}
