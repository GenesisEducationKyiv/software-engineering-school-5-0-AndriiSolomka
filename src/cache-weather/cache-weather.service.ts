import { Injectable } from '@nestjs/common';
import { WEATHER_CASH } from 'src/constants/enums/redis/weather-cash.enum';
import { RedisRepository } from 'src/redis/redis.repository';
import { CreateWeatherDto } from 'src/weather-handlers/dto/create-weather.dto';

@Injectable()
export class CacheWeatherService {
  constructor(private readonly redis: RedisRepository) {}

  private getKey(city: string): string {
    return `weather:${city.toLowerCase()}`;
  }

  async get(city: string): Promise<CreateWeatherDto | null> {
    const data = await this.redis.get(WEATHER_CASH.PREFIX, this.getKey(city));
    return data ? (JSON.parse(data) as CreateWeatherDto) : null;
  }

  async set(city: string, value: CreateWeatherDto): Promise<void> {
    await this.redis.setWithExpiry(
      WEATHER_CASH.PREFIX,
      this.getKey(city),
      JSON.stringify(value),
      WEATHER_CASH.TTL,
    );
  }
}
