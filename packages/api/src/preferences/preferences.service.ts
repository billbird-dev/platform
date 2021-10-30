import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchasePreferencesDto, SalePreferencesDto } from './preferences.dto';
import { PurchasePreferenceEntity } from './purchase-preferences.entity';
import { SalePreferenceEntity } from './sale-preferences.entity';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(SalePreferenceEntity)
    private readonly salePrefRepo: Repository<SalePreferenceEntity>,

    @InjectRepository(PurchasePreferenceEntity)
    private readonly purchasePrefRepo: Repository<PurchasePreferenceEntity>,
  ) {}

  async createOrUpdateSalePref(companyId: number, pref: SalePreferencesDto) {
    const sale_pref = await this.salePrefRepo.findOne({ where: { company: companyId } });

    if (!sale_pref) {
      const new_sale_pref = await this.salePrefRepo
        .create({ ...pref, company: { id: companyId } })
        .save();

      return new_sale_pref;
    }

    await this.salePrefRepo.update({ company: { id: companyId } }, { ...pref });

    return this.getSalePref(companyId);
  }

  async getSalePref(companyId: number) {
    const sale_pref = await this.salePrefRepo.findOne({ where: { company: companyId } });

    if (!sale_pref) throw new HttpException('Sale preferences not found !', 404);

    return sale_pref;
  }

  async createOrUpdatePurchasePref(companyId: number, pref: PurchasePreferencesDto) {
    const purchase_pref = await this.purchasePrefRepo.findOne({ where: { company: companyId } });

    if (!purchase_pref) {
      const new_purchase_pref = await this.purchasePrefRepo
        .create({ ...pref, company: { id: companyId } })
        .save();

      return new_purchase_pref;
    }

    await this.purchasePrefRepo.update({ company: { id: companyId } }, { ...pref });

    return this.getPurchasePref(companyId);
  }

  async getPurchasePref(companyId: number) {
    const purchase_pref = await this.purchasePrefRepo.findOne({ where: { company: companyId } });

    if (!purchase_pref) throw new HttpException('Purchase preferences not found !', 404);

    return purchase_pref;
  }
}
