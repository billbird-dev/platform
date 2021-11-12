import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CompanyWithParent } from 'src/auth/auth.interfaces';
import { CompanyService } from 'src/company/company.service';
import { Repository } from 'typeorm';
import { CreateEstimateDto, UpdateEstimateDto } from './estimate.dto';
import { EstimateEntity } from './estimate.entity';

@Injectable()
export class EstimateService {
  constructor(
    private readonly companyService: CompanyService,
    @InjectRepository(EstimateEntity) private readonly estimateRepo: Repository<EstimateEntity>,
  ) {}

  async create(company: CompanyWithParent, estimateData: CreateEstimateDto) {
    const updated_company = await this.companyService.updateCompany(company.id, {
      estimate_invoice_count: company.estimate_invoice_count + 1,
    });

    const invoice_name = `${(
      updated_company.name ||
      updated_company.username ||
      updated_company.email
    )
      .split(' ')
      .map((e) => e[0])
      .join('')}${dayjs().format('YYYYMMDD')}`.toUpperCase();

    const invoice_number = `${invoice_name}-${updated_company.estimate_invoice_count}`;

    const new_estimate_invoice = await this.estimateRepo
      .create({
        ...estimateData,
        company: { id: updated_company.id },
        invoice_number,
        customer: { id: estimateData.customer },
      })
      .save();

    if (!new_estimate_invoice) throw new HttpException('Unable to create estimate invoice', 500);

    return new_estimate_invoice;
  }

  async findAll(companyId: number) {
    const estimate_invoices = await this.estimateRepo.find({
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

    if (!estimate_invoices) throw new HttpException('No estimate invoice was found', 404);

    return estimate_invoices;
  }

  async findOne(companyId: number, id: number) {
    const estimate_invoice = await this.estimateRepo.findOne({
      where: { company: companyId, id },
      relations: ['customer', 'company'],
    });

    if (!estimate_invoice) throw new HttpException('No estimate invoice was found', 404);

    return estimate_invoice;
  }

  update(companyId: number, id: number, updateEstimateDto: UpdateEstimateDto) {
    this.estimateRepo.update({ id, company: { id: companyId } }, { ...updateEstimateDto });

    return this.findOne(companyId, id);
  }
  // remove(id: number) {
  //   return `This action removes a #${id} estimate`;
  // }
}
