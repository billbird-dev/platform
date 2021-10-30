import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CompanyWithParent } from 'src/auth/auth.interfaces';
import { CompanyEntity } from 'src/company/company.entity';
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
      .join('')}${dayjs().format('YYYYMMDD')}`;

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

  async findAll(companyId: number) {
    const sale_invoices = await this.saleRepo.find({
      where: { company: companyId },
      join: {
        alias: 'sale',
        leftJoinAndSelect: {
          customer: 'sale.customer',
        },
      },
      loadRelationIds: {
        relations: ['company'],
      },
    });

    // const sale_invoices = await this.saleRepo
    //   .createQueryBuilder('sale')
    //   .leftJoinAndSelect('sale.customer', 'customer')
    //   .leftJoin('sale.company', 'company')
    //   .addSelect(['company.id'])
    //   .where('sale.company_id = :id', { id: companyId })
    //   .getMany();

    if (!sale_invoices) throw new HttpException('No sale invoice found', 404);

    return sale_invoices;
  }

  async findOne(companyId: number, id: number) {
    const sale_invoice = await this.saleRepo.findOne({
      where: { company: companyId, id },
      relations: ['customer', 'company'],
    });

    if (!sale_invoice) throw new HttpException('Sale invoive not found', 404);

    return sale_invoice;
  }

  update(id: number, updateSaleDto: any) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
