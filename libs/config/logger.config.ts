import { Configuration, Value } from '@itgorillaz/configify';
import { IsBoolean, IsOptional } from 'class-validator';

@Configuration()
export class LoggerConfig {
  @IsBoolean()
  @IsOptional()
  @Value('ENABLE_FILE_LOGGING', {
    parse: (val) => val === 'true',
    default: false,
  })
  enableLogging: boolean;

  @IsBoolean()
  @IsOptional()
  @Value('ENABLE_DEBUG_LOGGING', {
    parse: (val) => val === 'true',
    default: false,
  })
  enableDebugLogging: boolean;
}
