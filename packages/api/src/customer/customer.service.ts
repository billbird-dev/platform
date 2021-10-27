import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto, updateCustomerDto } from './customer.dto';
import { CustomerEntity } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity) private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(CompanyEntity) private companyRepo: Repository<CompanyEntity>,
  ) {}

  async createCustomer(cutomerData: CreateCustomerDto, companyId: number) {
    return await this.customerRepo.create({ ...cutomerData, company: { id: companyId } }).save();
  }

  async getAllCustomers(companyId: number) {
    return await this.customerRepo.find({ company: { id: companyId } });
  }

  async getChildCustomers(parentId: number, childId: number) {
    const parentWithChild = await this.companyRepo.find({
      where: { id: childId, parent: parentId },
      relations: ['parent'],
    });

    if (!parentWithChild.length)
      throw new HttpException("The requested child company doesn't belong to this company", 400);

    return await this.getAllCustomers(childId);
  }

  async getById(companyId: number, id: number) {
    const customer = await this.customerRepo.findOne({ id, company: { id: companyId } });

    if (!!customer) return customer;

    throw new HttpException("Customer doesn't exist", 400);
  }

  async updateById(companyId: number, id: number, customerData: updateCustomerDto) {
    await this.getById(companyId, id);

    await this.customerRepo.update({ id, company: { id: companyId } }, { ...customerData });

    return await this.getById(companyId, id);
  }

  async deleteById(companyId: number, id: number) {
    const doesCustomerExist = await this.getById(companyId, id);

    if (!doesCustomerExist) throw new HttpException('Customer not found', 400);

    await this.customerRepo.delete({ id, company: { id: companyId } });
  }
}
