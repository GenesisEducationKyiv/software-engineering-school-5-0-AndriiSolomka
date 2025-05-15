import { Injectable } from '@nestjs/common';
import { RedisRepository } from '../redis/redis.repository';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { WEATHER_CASH } from 'src/constants/enums/redis/weather-cash.enum';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';

@Injectable()
export class CashService {
  constructor(private readonly redis: RedisRepository) {}

  private async getFromCache<T>(city: string): Promise<T | null> {
    const key = city.toLowerCase();
    const data = await this.redis.get(WEATHER_CASH.PREFIX, key);
    return data ? (JSON.parse(data) as T) : null;
  }

  private async setToCache<T>(city: string, value: T): Promise<void> {
    const key = city.toLowerCase();
    await this.redis.setWithExpiry(
      WEATHER_CASH.PREFIX,
      key,
      JSON.stringify(value),
      WEATHER_CASH.TTL,
    );
  }

  async getWeather(city: string): Promise<CreateWeatherDto | null> {
    return this.getFromCache<CreateWeatherDto>(city);
  }

  async setWeather(city: string, value: CreateWeatherDto): Promise<void> {
    await this.setToCache<CreateWeatherDto>(city, value);
  }

  async getCity(city: string): Promise<ILocation[] | null> {
    return this.getFromCache<ILocation[]>(city);
  }

  async setCity(city: string, value: ILocation[]): Promise<void> {
    await this.setToCache<ILocation[]>(city, value);
  }
}
