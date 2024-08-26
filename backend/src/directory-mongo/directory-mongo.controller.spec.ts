import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryMongoController } from '@directory-mongo/directory-mongo.controller';

describe('DirectoryMongoController', () => {
  let controller: DirectoryMongoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectoryMongoController],
    }).compile();

    controller = module.get<DirectoryMongoController>(DirectoryMongoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
