import { Configuration, Value } from '@itgorillaz/configify';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@Configuration()
export class LoggerConfig {
  @IsBoolean()
  @IsOptional()
  @Value('ENABLE_FILE_LOGGING', {
    parse: (val) => val === 'true',
  })
  enableLogging: boolean;

  @IsBoolean()
  @IsOptional()
  @Value('ENABLE_DEBUG_LOGGING', {
    parse: (val) => val === 'true',
  })
  enableDebugLogging: boolean;

  @IsString()
  @IsOptional()
  @Value('LOG_FILE_PATH')
  filePath: string;
}
