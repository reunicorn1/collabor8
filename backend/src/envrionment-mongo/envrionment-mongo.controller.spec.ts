import { Test, TestingModule } from '@nestjs/testing';
import { EnvrionmentMongoController } from './envrionment-mongo.controller';

describe('EnvrionmentMongoController', () => {
  let controller: EnvrionmentMongoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvrionmentMongoController],
    }).compile();

    controller = module.get<EnvrionmentMongoController>(EnvrionmentMongoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
