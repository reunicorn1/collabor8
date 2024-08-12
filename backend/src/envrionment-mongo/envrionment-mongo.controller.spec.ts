import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentMongoController } from './envrionment-mongo.controller';

describe('EnvrionmentMongoController', () => {
  let controller: EnvironmentMongoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentMongoController],
    }).compile();

    controller = module.get<EnvironmentMongoController>(
      EnvironmentMongoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
