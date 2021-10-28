import { CompanyEntity } from 'src/company/company.entity';
import { CustomerEntity } from 'src/customer/customer.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SaleItem } from './sate-item.interface';

@Entity('sale')
export class SaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CompanyEntity, { onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
  })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 30 })
  invoice_number: string;

  @Column('timestamp', { nullable: true })
  date: Date;

  @ManyToOne(() => CustomerEntity, { onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'customer_id',
    referencedColumnName: 'id',
  })
  customer: CustomerEntity;

  @Column({ type: 'text', nullable: true })
  billing_address: string;

  @Column({ type: 'text', nullable: true })
  shipping_address: string;

  @Column('float', { default: 0.0 })
  gross_total: number;

  @Column('float', { default: 0.0 })
  discount: number;

  @Column('float', { default: 0.0 })
  taxable_amount: number;

  @Column('float', { default: 0.0 })
  cgst_percent: number;

  @Column('float', { default: 0.0 })
  sgst_percent: number;

  @Column('float', { default: 0.0 })
  igst_percent: number;

  @Column('float', { default: 0.0 })
  cgst_value: number;

  @Column('float', { default: 0.0 })
  sgst_value: number;

  @Column('float', { default: 0.0 })
  igst_value: number;

  @Column('float', { default: 0.0 })
  net_amount: number;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  items: SaleItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
