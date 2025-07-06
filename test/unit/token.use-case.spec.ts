import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  TokenRepositoryInterface,
  TokenRepositoryToken,
} from 'src/core/abstracts/token/token-repository.interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';
import { TokenUseCase } from 'src/use-cases/token/token.use-case';

jest.mock('src/utils/generator/random-generator', () => ({
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

describe('TokenUseCase', () => {
  let useCase: TokenUseCase;
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
        TokenUseCase,
        {
          provide: TokenRepositoryToken,
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<TokenUseCase>(TokenUseCase);
  });

  describe('create', () => {
    it('should generate token and save it', async () => {
      repoMock.create.mockResolvedValueOnce(makeToken());

      const result = await useCase.create(123);

      expect(result).toBe('mocked-token');
      expect(repoMock.create).toHaveBeenCalledWith('mocked-token', 123);
    });
  });

  describe('getEntity', () => {
    it('should return token entity if found', async () => {
      const tokenEntity = makeToken();
      tokenEntity.token = 'mocked-token';

      repoMock.findOne.mockResolvedValueOnce(tokenEntity);

      const result = await useCase.getEntity('mocked-token');

      expect(repoMock.findOne).toHaveBeenCalledWith('mocked-token');
      expect(result).toBe(tokenEntity);
    });

    it('should throw NotFoundException if token not found', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);

      await expect(useCase.getEntity('not-exist')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
