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
import { TransactionsEntity } from 'src/transactions/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleEntity,
      CompanyEntity,
      SalePreferenceEntity,
      PurchasePreferenceEntity,
      TransactionsEntity,
    ]),
  ],
  controllers: [SaleController],
  providers: [SaleService, CompanyService, PreferencesService, TransactionsService],
  exports: [SaleService],
})
export class SaleModule {}
