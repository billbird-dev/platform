import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsEntity } from './transaction.entity';
import { CreditDto, DebitDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepo: Repository<TransactionsEntity>,
  ) {}

  async credit(companyId: number, credit: CreditDto) {
    const credit_transaction = await this.transactionsRepo
      .create({
        company: { id: companyId },
        sale_bill: { id: credit.sale_bill },
        credit: credit.credit,
      })
      .save();

    if (!credit_transaction) throw new HttpException('Unable to create ledger entry', 500);

    return credit_transaction;
  }

  async debit(companyId: number, debit: DebitDto) {
    const debit_transaction = await this.transactionsRepo
      .create({
        company: { id: companyId },
        purchase_bill: { id: debit.purchase_bill },
        debit: debit.debit,
      })
      .save();

    if (!debit_transaction) throw new HttpException('Unable to create ledger entry', 500);

    return debit_transaction;
  }

  async getTransaction(companyId: number) {
    const transactions = await this.transactionsRepo
      .createQueryBuilder('transaction')
      .leftJoin('transaction.sale_bill', 'sale')
      .addSelect(['sale.invoice_number', 'sale.id'])
      .leftJoin('transaction.purchase_bill', 'purchase')
      .addSelect(['purchase.invoice_number', 'purchase.id'])
      .where('transaction.company_id = :id', { id: companyId })
      .getMany();

    if (!transactions) throw new HttpException('Unable to retrive ledger entries', 500);

    return transactions;
  }
}
