import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSharesController } from './project-shares.controller';

describe('ProjectSharesController', () => {
  let controller: ProjectSharesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSharesController],
    }).compile();

    controller = module.get<ProjectSharesController>(ProjectSharesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
