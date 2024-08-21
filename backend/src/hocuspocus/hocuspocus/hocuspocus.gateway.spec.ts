import { Test, TestingModule } from '@nestjs/testing';
import { HocuspocusGateway } from './hocuspocus.gateway';

describe('HocuspocusGateway', () => {
  let gateway: HocuspocusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HocuspocusGateway],
    }).compile();

    gateway = module.get<HocuspocusGateway>(HocuspocusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
