import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { CompanyService } from 'src/company/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { SalePreferenceEntity } from 'src/preferences/sale-preferences.entity';
import { PurchasePreferenceEntity } from 'src/preferences/purchase-preferences.entity';
import { PreferencesService } from 'src/preferences/preferences.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionsEntity } from 'src/transactions/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseEntity,
      CompanyEntity,
      SalePreferenceEntity,
      PurchasePreferenceEntity,
      TransactionsEntity,
    ]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, CompanyService, PreferencesService, TransactionsService],
})
export class PurchaseModule {}
