import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TokenEntity } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';
import {
  TokenRepositoryInterface,
  TokenRepositoryToken,
} from 'apps/weather_api/src/infrastructure/subscription-management/core/token/token-repository.interface';
import { TokenService } from 'apps/weather_api/src/infrastructure/subscription-management/infrastructure/services/token.service';

import { TokenInterface } from '../../core/token/token-interface';

jest.mock('apps/weather_api/src/utils/generator/random-generator', () => ({
  randomByteGenerator: () => 'mocked-token',
}));

function makeToken(): TokenEntity {
  const now = new Date();
  return {
    tokenId: 1,
    subscriptionId: 123,
    token: 'mocked-token',
    createdAt: now,
    expiresAt: now,
  };
}

describe('TokenService', () => {
  let service: TokenInterface;
  let repoMock: jest.Mocked<
    Pick<TokenRepositoryInterface, 'create' | 'findOne'>
  >;

  beforeEach(async () => {
    repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: TokenRepositoryToken,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<TokenInterface>(TokenService);
  });

  describe('create', () => {
    it('should generate token and save it', async () => {
      repoMock.create.mockResolvedValueOnce(makeToken());

      const result = await service.create(123);

      expect(result).toBe('mocked-token');
      expect(repoMock.create).toHaveBeenCalledWith('mocked-token', 123);
    });
  });

  describe('getEntity', () => {
    it('should return token entity if found', async () => {
      const tokenEntity = makeToken();
      tokenEntity.token = 'mocked-token';

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
