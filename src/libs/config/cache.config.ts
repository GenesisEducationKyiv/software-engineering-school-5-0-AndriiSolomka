import { Configuration, Value } from '@itgorillaz/configify';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@Configuration()
export class CacheConfig {
  @IsString()
  @IsNotEmpty()
  @Value('CITY_CACHE_PREFIX', { default: 'city' })
  cityCachePrefix: string;

  @IsInt()
  @IsPositive()
  @Value('CITY_CACHE_TTL', {
    parse: (val: string) => parseInt(val, 10),
    default: 600,
  })
  cityCacheTTL: number;
}
