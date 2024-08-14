import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSharesMongoService } from './project-shares-mongo.service';

describe('ProjectSharesMongoService', () => {
  let service: ProjectSharesMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSharesMongoService],
    }).compile();

    service = module.get<ProjectSharesMongoService>(ProjectSharesMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
