import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { PreferencesService } from './preferences.service';
import { PurchasePreferenceEntity } from './purchase-preferences.entity';
import { SalePreferenceEntity } from './sale-preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalePreferenceEntity, PurchasePreferenceEntity, CompanyEntity]),
  ],
  providers: [PreferencesService],
})
export class PreferencesModule {}
