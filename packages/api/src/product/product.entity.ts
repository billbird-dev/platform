import { CompanyEntity } from '../company/company.entity';
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

@Entity('product')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CompanyEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'company_id' })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  brand: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float', { default: 0.0 })
  rate: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hsn_code: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 10, default: 'pcs' })
  unit: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
