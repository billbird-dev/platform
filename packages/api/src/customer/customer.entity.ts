import { CompanyEntity } from 'src/company/company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CompanyEntity, (companyEntity) => companyEntity.customers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  company: CompanyEntity;

  @Column({ length: 30, type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 254 })
  email: string;

  @Column({ type: 'bigint', nullable: false })
  phone: number;

  @Column({ length: 30, type: 'varchar' })
  gstin: string;

  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ type: 'boolean', default: false })
  registeredGstMember: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
