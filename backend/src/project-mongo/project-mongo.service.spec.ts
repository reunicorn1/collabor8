import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMongoService } from '@project-mongo/project-mongo.service';

describe('ProjectMongoService', () => {
  let service: ProjectMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectMongoService],
    }).compile();

    service = module.get<ProjectMongoService>(ProjectMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
