import { Test, TestingModule } from '@nestjs/testing';
import { EstimateService } from './estimate.service';

describe('EstimateService', () => {
  let service: EstimateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstimateService],
    }).compile();

    service = module.get<EstimateService>(EstimateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
