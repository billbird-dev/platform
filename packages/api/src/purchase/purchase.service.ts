import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CompanyWithParent } from 'src/auth/auth.interfaces';
import { CompanyService } from 'src/company/company.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './purchase.dto';
import { PurchaseEntity } from './purchase.entity';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly ledgerService: TransactionsService,
    @InjectRepository(PurchaseEntity) private readonly purchaseRepo: Repository<PurchaseEntity>,
  ) {}

  async create(company: CompanyWithParent, purchaseData: CreatePurchaseDto) {
    const updated_company = await this.companyService.updateCompany(company.id, {
      purchase_invoice_count: company.purchase_invoice_count + 1,
    });

    const invoice_name = `${(
      updated_company.name ||
      updated_company.username ||
      updated_company.email
    )
      .split(' ')
      .map((e) => e[0])
      .join('')}${dayjs().format('YYYYMMDD')}`.toUpperCase();

    const invoice_number = `${invoice_name}-${updated_company.purchase_invoice_count}`;

    const new_purchase_invoice = await this.purchaseRepo
      .create({
        ...purchaseData,
        company: { id: updated_company.id },
        invoice_number,
        supplier: { id: purchaseData.supplier },
      })
      .save();

    if (!new_purchase_invoice) throw new HttpException('Unable to create purchase invoice', 500);

    await this.ledgerService.debit(company.id, {
      debit: new_purchase_invoice.net_amount,
      purchase_bill: new_purchase_invoice.id,
    });

    return new_purchase_invoice;
  }

  async findAll(companyId: number) {
    const purchase_invoices = await this.purchaseRepo.find({
      where: { company: companyId },
      join: {
        alias: 'purchase',
        leftJoinAndSelect: {
          supplier: 'purchase.supplier',
        },
      },
      loadRelationIds: {
        relations: ['company'],
      },
    });

    // const purchase_invoices = await this.purchaseRepo
    //   .createQueryBuilder('purchase')
    //   .leftJoinAndSelect('purchase.supplier', 'supplier')
    //   .leftJoin('purchase.company', 'company')
    //   .addSelect(['company.id'])
    //   .where('purchase.company_id = :id', { id: companyId })
    //   .getMany();

    if (!purchase_invoices) throw new HttpException('No purchase invoice found', 404);

    return purchase_invoices;
  }

  async findOne(companyId: number, id: number) {
    const purchase_invoice = await this.purchaseRepo.findOne({
      where: { company: companyId, id },
      relations: ['supplier', 'company'],
    });

    if (!purchase_invoice) throw new HttpException('Purchase invoice not found', 404);

    return purchase_invoice;
  }

  // update(id: number, updatePurchaseDto: any) {
  //   return `This action updates a #${id} purchase`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchase`;
  // }
}
