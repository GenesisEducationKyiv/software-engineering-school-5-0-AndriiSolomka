import { Configuration, Value } from '@itgorillaz/configify';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

@Configuration()
export class RedisConfig {
  @IsString()
  @IsNotEmpty()
  @Value('REDIS_HOST', { default: 'localhost' })
  host: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @Value('REDIS_PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 6379,
  })
  port: number;
}
