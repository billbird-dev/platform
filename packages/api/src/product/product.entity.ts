import { CompanyEntity } from '../company/company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CompanyEntity, (CompanyEntity) => CompanyEntity.inventory, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float', { default: 0.0 })
  rate: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hsnCode: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 10, default: 'pcs' })
  unit: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
