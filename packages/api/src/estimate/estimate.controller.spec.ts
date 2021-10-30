import { Test, TestingModule } from '@nestjs/testing';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';

describe('EstimateController', () => {
  let controller: EstimateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimateController],
      providers: [EstimateService],
    }).compile();

    controller = module.get<EstimateController>(EstimateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
