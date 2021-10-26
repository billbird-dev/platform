import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';

@Module({
  controllers: [SaleController],
  providers: [SaleService]
})
export class SaleModule {}
