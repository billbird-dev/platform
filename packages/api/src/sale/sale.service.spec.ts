import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';

describe('SaleService', () => {
  let service: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleService],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
