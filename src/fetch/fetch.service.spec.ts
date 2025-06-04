import { FetchService } from './fetch.service';
import { AppLoggerService } from 'src/logger/app-logger.service';
import { HttpException } from '@nestjs/common';

describe('FetchService', () => {
  let service: FetchService;
  let logger: AppLoggerService;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
      logger: {},
    } as unknown as AppLoggerService;

    service = new FetchService(logger);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { message: 'success' };
    const mockResponse = {
      ok: true,
      json: () => mockData,
    } as unknown as Response;

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await service.get<typeof mockData>(
      'https://api.example.com',
    );

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://api.example.com');
  });

  it('should throw HttpException on failed fetch', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response;

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = 'https://api.example.com/notfound';

    await expect(service.get(url)).rejects.toThrow(HttpException);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(logger.error).toHaveBeenCalledWith(
      `${url}, Failed to fetch data: 404, Not Found`,
    );
  });
});
