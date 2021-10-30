import { CompanyEntity } from 'src/company/company.entity';
import { PurchaseEntity } from 'src/purchase/purchase.entity';
import { SaleEntity } from 'src/sale/sale.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class TransactionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp', { nullable: true, default: () => 'now()' })
  date: string;

  @ManyToOne(() => CompanyEntity, { onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
  })
  company: CompanyEntity;

  @Column('float', { default: 0.0, nullable: true })
  debit: number;

  @Column('float', { default: 0.0, nullable: true })
  credit: number;

  @ManyToOne(() => SaleEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({
    name: 'sale_id',
    referencedColumnName: 'id',
  })
  sale_bill: SaleEntity;

  @ManyToOne(() => PurchaseEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({
    name: 'purchase_id',
    referencedColumnName: 'id',
  })
  purchase_bill: PurchaseEntity;
}
