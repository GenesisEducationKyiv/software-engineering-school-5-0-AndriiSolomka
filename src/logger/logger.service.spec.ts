import { Test, TestingModule } from '@nestjs/testing';
import { AppLoggerService } from './app-logger.service';

describe('AppLogger', () => {
  let logger: AppLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLoggerService],
    }).compile();

    logger = module.get<AppLoggerService>(AppLoggerService);
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should log info', () => {
    const spy = jest.spyOn(logger['logger'], 'info').mockImplementation();
    logger.log('test info');
    expect(spy).toHaveBeenCalledWith('test info');
    spy.mockRestore();
  });

  it('should log error', () => {
    const spy = jest.spyOn(logger['logger'], 'error').mockImplementation();
    logger.error('test error');
    expect(spy).toHaveBeenCalledWith('test error');
    spy.mockRestore();
  });

  it('should log warn', () => {
    const spy = jest.spyOn(logger['logger'], 'warn').mockImplementation();
    logger.warn('test warn');
    expect(spy).toHaveBeenCalledWith('test warn');
    spy.mockRestore();
  });

  it('should log debug', () => {
    const spy = jest.spyOn(logger['logger'], 'debug').mockImplementation();
    logger.debug('test debug');
    expect(spy).toHaveBeenCalledWith('test debug');
    spy.mockRestore();
  });

  it('should log verbose (trace)', () => {
    const spy = jest.spyOn(logger['logger'], 'trace').mockImplementation();
    logger.verbose('test verbose');
    expect(spy).toHaveBeenCalledWith('test verbose');
    spy.mockRestore();
  });
});
