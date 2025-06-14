import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaTokenRepository } from './token.repository';
import { NotFoundException } from '@nestjs/common';
import { Token } from '@prisma/client';
import * as generator from 'src/utils/generator/random-generator';

describe('TokenService', () => {
  let service: TokenService;

  const mockTokenRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: PrismaTokenRepository, useValue: mockTokenRepository },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    service = module.get<TokenService>(TokenService);

    jest.clearAllMocks();
  });
  describe('create', () => {
    it('should generate and save token', async () => {
      const subscriptionId = 1;
      const fakeToken = 'generated-token';

      jest.spyOn(generator, 'randomByteGenerator').mockReturnValue(fakeToken);

      const result = await service.create(subscriptionId);

      expect(generator.randomByteGenerator).toHaveBeenCalled();
      expect(mockTokenRepository.create).toHaveBeenCalledWith(
        fakeToken,
        subscriptionId,
      );
      expect(result).toBe(fakeToken);
    });
  });

  describe('getEntity', () => {
    it('should return token entity if found', async () => {
      const token = 'my-token';
      const fakeEntity = {
        token,
        token_id: 1,
        subscription_id: 1,
        createdAt: new Date(),
        expiresAt: null,
      } as Token;

      mockTokenRepository.findOne.mockResolvedValue(fakeEntity);

      const result = await service.getEntity(token);

      expect(mockTokenRepository.findOne).toHaveBeenCalledWith(token);
      expect(result).toEqual(fakeEntity);
    });

    it('should throw NotFoundException if token not found', async () => {
      const token = 'non-existent-token';
      mockTokenRepository.findOne.mockResolvedValue(null);

      await expect(service.getEntity(token)).rejects.toThrow(NotFoundException);
      expect(mockTokenRepository.findOne).toHaveBeenCalledWith(token);
    });
  });
});
