import { NotFoundException } from '@nestjs/common';
import { TokenService } from '../token.service';
import {
  TokenRepository,
  TokenRepositoryToken,
} from '../interfaces/token-repository.interface';
import { Token } from '@prisma/client';
import { ITokenService } from '../interfaces/token-service.interface';
import { Test } from '@nestjs/testing';

jest.mock('src/utils/generator/random-generator', () => ({
  randomByteGenerator: () => 'mocked-token',
}));

function makeToken(overrides: Partial<Token> = {}): Token {
  const now = new Date();
  return {
    token_id: 1,
    token: 'mocked-token',
    subscription_id: 1,
    createdAt: now,
    expiresAt: null,
    ...overrides,
  };
}

describe('TokenService', () => {
  let service: ITokenService;
  let repoMock: jest.Mocked<Pick<TokenRepository, 'create' | 'findOne'>>;

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
      const tokenEntity = makeToken({
        token: 'mocked-token',
        subscription_id: 1,
      });
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
