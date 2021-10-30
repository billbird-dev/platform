import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { CompanyService } from 'src/company/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase.entity';
import { CompanyEntity } from 'src/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity, CompanyEntity])],
  controllers: [PurchaseController],
  providers: [PurchaseService, CompanyService],
})
export class PurchaseModule {}
