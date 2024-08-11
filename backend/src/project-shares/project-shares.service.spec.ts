import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSharesService } from './project-shares.service';

describe('ProjectSharesService', () => {
  let service: ProjectSharesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSharesService],
    }).compile();

    service = module.get<ProjectSharesService>(ProjectSharesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
