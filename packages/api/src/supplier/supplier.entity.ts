import { CompanyEntity } from 'src/company/company.entity';
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

@Entity('supplier')
export class SupplierEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CompanyEntity, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
  })
  company: CompanyEntity;

  @Column({ length: 30, type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 254 })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ length: 30, type: 'varchar' })
  gstin: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'boolean', default: false })
  registered_gst_member: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
