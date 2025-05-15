import { Injectable } from '@nestjs/common';
import { RedisRepository } from '../redis/redis.repository';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';

const WEATHER_PREFIX = 'weather';
const WEATHER_TTL = 600;

@Injectable()
export class WeatherCashService {
  constructor(private readonly redis: RedisRepository) {}

  async get(city: string): Promise<CreateWeatherDto | null> {
    const data = await this.redis.get(WEATHER_PREFIX, city.toLowerCase());
    return data ? (JSON.parse(data) as CreateWeatherDto) : null;
  }

  async set(city: string, value: CreateWeatherDto): Promise<void> {
    await this.redis.setWithExpiry(
      WEATHER_PREFIX,
      city.toLowerCase(),
      JSON.stringify(value),
      WEATHER_TTL,
    );
  }
}
