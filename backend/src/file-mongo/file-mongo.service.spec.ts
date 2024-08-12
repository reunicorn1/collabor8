import { Test, TestingModule } from '@nestjs/testing';
import { FileMongoService } from './file-mongo.service';

describe('FileMongoService', () => {
  let service: FileMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileMongoService],
    }).compile();

    service = module.get<FileMongoService>(FileMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
