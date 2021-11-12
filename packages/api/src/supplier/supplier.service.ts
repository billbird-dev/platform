import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto, updateSupplierDto } from './supplier.dto';
import { SupplierEntity } from './supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity) private readonly supplierRepo: Repository<SupplierEntity>,
    @InjectRepository(CompanyEntity) private companyRepo: Repository<CompanyEntity>,
  ) {}

  async createSupplier(supplierData: CreateSupplierDto, companyId: number) {
    return await this.supplierRepo.create({ ...supplierData, company: { id: companyId } }).save();
  }

  async getAllSuppliers(companyId: number) {
    return await this.supplierRepo.find({ company: { id: companyId } });
  }

  async getChildSuppliers(parentId: number, childId: number) {
    const parentWithChild = await this.companyRepo.find({
      where: { id: childId, parent: parentId },
      relations: ['parent'],
    });

    if (!parentWithChild.length)
      throw new HttpException("The requested child company doesn't belong to this company", 400);

    return await this.getAllSuppliers(childId);
  }

  async getById(companyId: number, id: number) {
    const supplier = await this.supplierRepo.findOne({ id, company: { id: companyId } });

    if (!!supplier) return supplier;

    throw new HttpException("Supplier doesn't exist", 400);
  }

  async updateById(companyId: number, id: number, supplierData: updateSupplierDto) {
    await this.supplierRepo.update({ id, company: { id: companyId } }, { ...supplierData });

    return await this.getById(companyId, id);
  }

  async deleteById(companyId: number, id: number) {
    const doesSupplierExist = await this.getById(companyId, id);

    if (!doesSupplierExist) throw new HttpException('Supplier not found', 400);

    await this.supplierRepo.delete({ id, company: { id: companyId } });
  }
}
