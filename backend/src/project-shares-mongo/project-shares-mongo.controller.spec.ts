import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSharesMongoController } from './project-shares-mongo.controller';

describe('ProjectSharesMongoController', () => {
  let controller: ProjectSharesMongoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSharesMongoController],
    }).compile();

    controller = module.get<ProjectSharesMongoController>(
      ProjectSharesMongoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
