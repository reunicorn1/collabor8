import { Test, TestingModule } from '@nestjs/testing';
import { DockerController } from './docker.controller';

describe('DockerController', () => {
  let controller: DockerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DockerController],
    }).compile();

    controller = module.get<DockerController>(DockerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
