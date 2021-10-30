import { CompanyEntity } from 'src/company/company.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale_preferences')
export class SalePreferenceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CompanyEntity, { onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
  })
  company: CompanyEntity;

  @Column('float', { default: 0.0 })
  cgst_percent: number;

  @Column('float', { default: 0.0 })
  sgst_percent: number;

  @Column('float', { default: 0.0 })
  igst_percent: number;

  @Column('float', { default: 0.0 })
  discount_percent: number;
}
