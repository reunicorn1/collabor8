import { Test, TestingModule } from '@nestjs/testing';
import { FileMongoController } from './file-mongo.controller';

describe('FileMongoController', () => {
  let controller: FileMongoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileMongoController],
    }).compile();

    controller = module.get<FileMongoController>(FileMongoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
