import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from './sale.entity';
import { CompanyService } from 'src/company/company.service';
import { CompanyEntity } from 'src/company/company.entity';
import { PreferencesService } from 'src/preferences/preferences.service';
import { SalePreferenceEntity } from 'src/preferences/sale-preferences.entity';
import { PurchasePreferenceEntity } from 'src/preferences/purchase-preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleEntity,
      CompanyEntity,
      SalePreferenceEntity,
      PurchasePreferenceEntity,
    ]),
  ],
  controllers: [SaleController],
  providers: [SaleService, CompanyService, PreferencesService],
  exports: [SaleService],
})
export class SaleModule {}
