import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CompanyWithParent } from 'src/auth/auth.interfaces';
import { CompanyService } from 'src/company/company.service';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './sale.dto';
import { SaleEntity } from './sale.entity';

@Injectable()
export class SaleService {
  constructor(
    private readonly companyService: CompanyService,
    @InjectRepository(SaleEntity) private readonly saleRepo: Repository<SaleEntity>,
  ) {}

  async create(company: CompanyWithParent, saleData: CreateSaleDto) {
    const update_company = await this.companyService.updateCompany(company.id, {
      sale_invoice_count: company.sale_invoice_count + 1,
    });

    const invoice_name = `${(update_company.name || update_company.username || update_company.email)
      .split(' ')
      .map((e) => e[0])
      .join()}${dayjs().format('YYYYMMDD')}`;

    const invoice_number = `${invoice_name}-${update_company.sale_invoice_count}`;

    const new_sale_invoice = await this.saleRepo
      .create({
        ...saleData,
        company: { id: update_company.id },
        invoice_number,
        customer: { id: saleData.customer },
      })
      .save();

    return new_sale_invoice;
  }

  findAll() {
    return `This action returns all sale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: any) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
