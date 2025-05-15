import { Injectable } from '@nestjs/common';
import { WEATHER_CASH } from 'src/constants/enums/redis/weather-cash.enum';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';
import { RedisRepository } from 'src/redis/redis.repository';

@Injectable()
export class CacheCityService {
  constructor(private readonly redis: RedisRepository) {}

  private getKey(city: string): string {
    return `location:${city.toLowerCase()}`;
  }

  async get(city: string): Promise<ILocation[] | null> {
    const data = await this.redis.get(WEATHER_CASH.PREFIX, this.getKey(city));
    return data ? (JSON.parse(data) as ILocation[]) : null;
  }

  async set(city: string, value: ILocation[]): Promise<void> {
    await this.redis.setWithExpiry(
      WEATHER_CASH.PREFIX,
      this.getKey(city),
      JSON.stringify(value),
      WEATHER_CASH.TTL,
    );
  }
}
