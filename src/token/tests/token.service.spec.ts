import { NotFoundException } from '@nestjs/common';
import { TokenService } from '../token.service';
import { TokenRepository } from '../interfaces/token-repository.interface';
import { Token } from '@prisma/client';
import { ITokenService } from '../interfaces/token-service.interface';

jest.mock('src/utils/generator/random-generator', () => ({
  randomByteGenerator: () => 'mocked-token',
}));

describe('TokenService', () => {
  let service: ITokenService;
  let repoMock: jest.Mocked<Pick<TokenRepository, 'create' | 'findOne'>>;

  beforeEach(() => {
    repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
    };
    service = new TokenService(repoMock as unknown as TokenRepository);
  });

  describe('create', () => {
    it('should generate token and save it', async () => {
      repoMock.create.mockResolvedValueOnce({} as Token);

      const result = await service.create(123);

      expect(result).toBe('mocked-token');
      expect(repoMock.create).toHaveBeenCalledWith('mocked-token', 123);
    });
  });

  describe('getEntity', () => {
    it('should return token entity if found', async () => {
      const tokenEntity = {
        token: 'mocked-token',
        subscription_id: 1,
      } as Token;
      repoMock.findOne.mockResolvedValueOnce(tokenEntity);

      const result = await service.getEntity('mocked-token');

      expect(repoMock.findOne).toHaveBeenCalledWith('mocked-token');
      expect(result).toBe(tokenEntity);
    });

    it('should throw NotFoundException if token not found', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);

      await expect(service.getEntity('not-exist')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
