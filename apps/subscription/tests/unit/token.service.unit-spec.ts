import { Test } from '@nestjs/testing';
import { TokenEntity } from 'apps/subscription/src/core/entities/subscription.entity';
import { TokenInterface } from 'apps/subscription/src/core/token/token-interface';
import {
  TokenRepositoryInterface,
  TokenRepositoryToken,
} from 'apps/subscription/src/core/token/token-repository.interface';
import { TokenNotFoundException } from 'apps/subscription/src/infrastructure/errors/custom.errors';
import { TokenService } from 'apps/subscription/src/infrastructure/services/token.service';
import { randomUUID } from 'crypto';

jest.mock('libs/utils/generator/random-generator', () => ({
  randomByteGenerator: () => 'mocked-token',
}));

function makeToken(): TokenEntity {
  const now = new Date();
  return {
    tokenId: randomUUID(),
    subscriptionId: randomUUID(),
    token: 'mocked-token',
    createdAt: now,
    expiresAt: now,
  };
}

describe('TokenService (unit)', () => {
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
      const id = randomUUID();
      const result = await service.create(id);

      expect(result).toBe('mocked-token');
      expect(repoMock.create).toHaveBeenCalledWith('mocked-token', id);
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
        TokenNotFoundException,
      );
    });
  });
});
