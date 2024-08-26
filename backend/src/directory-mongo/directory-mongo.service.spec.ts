import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryMongoService } from '@directory-mongo/directory-mongo.service';

describe('DirectoryMongoService', () => {
  let service: DirectoryMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectoryMongoService],
    }).compile();

    service = module.get<DirectoryMongoService>(DirectoryMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
