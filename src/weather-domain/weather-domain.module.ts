import { Module } from '@nestjs/common';
import { WeatherDomainService } from './weather-domain.service';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [WeatherDomainService],
  exports: [WeatherDomainService],
})
export class WeatherDomainModule {}
