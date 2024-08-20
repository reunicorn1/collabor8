import { Test, TestingModule } from '@nestjs/testing';
import { HocuspocusService } from './hocuspocus.service';

describe('HocuspocusService', () => {
  let service: HocuspocusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HocuspocusService],
    }).compile();

    service = module.get<HocuspocusService>(HocuspocusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
