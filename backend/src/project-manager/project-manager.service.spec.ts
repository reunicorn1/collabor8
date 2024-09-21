import { Test, TestingModule } from '@nestjs/testing';
import { ProjectManagerService } from './project-manager.service';

describe('ProjectManagerService', () => {
  let service: ProjectManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectManagerService],
    }).compile();

    service = module.get<ProjectManagerService>(ProjectManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
