import { AppLoggerService } from './app-logger.service';
import { createPinoLogger } from 'src/utils/logger/logger.factory';

jest.mock('src/utils/logger/logger.factory');

describe('AppLoggerService', () => {
  let service: AppLoggerService;
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

  beforeEach(() => {
    (createPinoLogger as jest.Mock).mockReturnValue(mockLogger);
    service = new AppLoggerService();
    jest.clearAllMocks();
  });

  it('should call logger.info on log()', () => {
    service.log('Log message', { extra: 'data' });
    expect(mockLogger.info).toHaveBeenCalledWith('Log message', {
      extra: 'data',
    });
  });

  it('should call logger.error on error()', () => {
    service.error('Error message', new Error('Oops'));
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Error message',
      new Error('Oops'),
    );
  });

  it('should call logger.warn on warn()', () => {
    service.warn('Warning message');
    expect(mockLogger.warn).toHaveBeenCalledWith('Warning message');
  });

  it('should call logger.debug on debug()', () => {
    service.debug('Debug message');
    expect(mockLogger.debug).toHaveBeenCalledWith('Debug message');
  });

  it('should call logger.trace on verbose()', () => {
    service.verbose('Verbose message');
    expect(mockLogger.trace).toHaveBeenCalledWith('Verbose message');
  });
});
