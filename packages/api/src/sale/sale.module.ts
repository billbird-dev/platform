import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from './sale.entity';
import { CompanyService } from 'src/company/company.service';
import { CompanyEntity } from 'src/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleEntity, CompanyEntity])],
  controllers: [SaleController],
  providers: [SaleService, CompanyService],
  exports: [SaleService],
})
export class SaleModule {}
