import { NotFoundException } from '@nestjs/common';

import { Test } from '@nestjs/testing';
import {
  TokenRepositoryInterface,
  TokenRepositoryToken,
} from 'src/core/abstracts/token/token.interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';
import { TokenService } from 'src/use-cases/token/token.service';

jest.mock('src/utils/generator/random-generator', () => ({
  randomByteGenerator: () => 'mocked-token',
}));

function makeToken(): TokenEntity {
  const now = new Date();
  return {
    token_id: 1,
    subscription_id: 123,
    token: 'mocked-token',
    createdAt: now,
    expiresAt: now,
  };
}

describe('TokenService', () => {
  let service: TokenService;
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

    service = module.get<TokenService>(TokenService);
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
