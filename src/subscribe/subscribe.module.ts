import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { EmailModule } from 'src/email/email.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    EmailModule,
    SubscriptionModule,
    WeatherModule,
    CityModule,
  ],
  providers: [SubscribeService],
  controllers: [SubscribeController],
})
export class SubscribeModule {}
