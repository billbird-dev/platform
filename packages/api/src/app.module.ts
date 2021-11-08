import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/db.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { SaleModule } from './sale/sale.module';
import { EstimateModule } from './estimate/estimate.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PreferencesModule } from './preferences/preferences.module';
import { TransactionsModule } from './transactions/transactions.module';
import { join } from 'path';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ envFilePath: join(__dirname, '../.env') }),
    CompanyModule,
    AuthModule,
    InventoryModule,
    CustomerModule,
    SaleModule,
    EstimateModule,
    SupplierModule,
    PurchaseModule,
    PreferencesModule,
    TransactionsModule,
  ],
})
export class AppModule {}
