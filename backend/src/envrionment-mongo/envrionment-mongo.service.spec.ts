import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentMongoService } from './envrionment-mongo.service';

describe('EnvrionmentMongoService', () => {
  let service: EnvironmentMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentMongoService],
    }).compile();

    service = module.get<EnvironmentMongoService>(EnvironmentMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
