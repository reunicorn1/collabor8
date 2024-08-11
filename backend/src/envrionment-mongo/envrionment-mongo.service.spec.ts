import { Test, TestingModule } from '@nestjs/testing';
import { EnvrionmentMongoService } from './envrionment-mongo.service';

describe('EnvrionmentMongoService', () => {
  let service: EnvrionmentMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvrionmentMongoService],
    }).compile();

    service = module.get<EnvrionmentMongoService>(EnvrionmentMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
