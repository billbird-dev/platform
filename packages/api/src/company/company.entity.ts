import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'company' })
export class CompanyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 150 })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 128 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 254 })
  email: string;

  @Column({ type: 'bigint', nullable: false })
  phone: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_premium_member: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_parent: boolean;

  @Column({ type: 'int', default: 1 })
  sale_invoice_count: number;

  @Column({ type: 'int', default: 1 })
  purchase_invoice_count: number;

  @Column({ type: 'int', default: 1 })
  estimate_invoice_count: number;

  //  @Column({ type: 'int', nullable: false })
  //   role;

  @ManyToOne((type) => CompanyEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: CompanyEntity;

  @Column({ type: 'varchar', length: 50 })
  branch: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'int', nullable: true })
  pincode: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  gstin: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  state_code: string;

  @Column({ type: 'timestamp', nullable: true })
  valid_till: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  current_hashed_refresh_token?: string;
}
