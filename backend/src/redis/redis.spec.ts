import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from './redis';

describe('Redis', () => {
  let provider: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Redis],
    }).compile();

    provider = module.get<Redis>(Redis);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
