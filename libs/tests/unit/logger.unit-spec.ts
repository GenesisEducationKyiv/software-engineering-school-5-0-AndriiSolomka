import { Test, TestingModule } from '@nestjs/testing';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { LoggerService } from 'libs/infrastructure/logger/logger.service';
import { createPinoLogger } from 'libs/utils/logger/logger.factory';

jest.mock('apps/weather_api/src/utils/logger/logger.factory', () => ({
  createPinoLogger: jest.fn(),
}));

describe('LoggerService', () => {
  let service: LoggerInterface;

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

  beforeEach(async () => {
    (createPinoLogger as jest.Mock).mockReturnValue(mockLogger);

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = moduleRef.get<LoggerInterface>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log info via log()', () => {
    service.log('Info message', { foo: 'bar' });

    expect(mockLogger.info).toHaveBeenCalledWith('Info message', {
      foo: 'bar',
    });
  });

  it('should log error via error()', () => {
    service.error('Error message', { code: 500 });

    expect(mockLogger.error).toHaveBeenCalledWith('Error message', {
      code: 500,
    });
  });

  it('should log warning via warn()', () => {
    service.warn('Warning!', 'details');

    expect(mockLogger.warn).toHaveBeenCalledWith('Warning!', 'details');
  });

  it('should log debug via debug()', () => {
    service.debug('Debug message');

    expect(mockLogger.debug).toHaveBeenCalledWith('Debug message');
  });

  it('should log verbose via trace()', () => {
    service.verbose('Verbose info');

    expect(mockLogger.trace).toHaveBeenCalledWith('Verbose info');
  });
});
