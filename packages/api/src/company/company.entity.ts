import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'company' })
export class CompanyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 150 })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 128 })
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 254 })
  email: string;

  @Column({ type: 'int', nullable: false })
  phone: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  isPremiumMember: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isParent: boolean;

  // @Column({ type: 'int', nullable: false })
  // saleInvoiceCount;

  // @Column({ type: 'int', nullable: false })
  // purchaseInvoiceCount;

  // @Column({ type: 'int', nullable: false })
  // estimateInvoiceCount;

  @ManyToOne((type) => CompanyEntity, (CompanyEntity) => CompanyEntity.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: CompanyEntity;

  @OneToMany((type) => CompanyEntity, (CompanyEntity) => CompanyEntity.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  children: CompanyEntity[];

  //  @Column({ type: 'int', nullable: false })
  //   role;

  @Column({ type: 'varchar', length: 50 })
  branch: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'int', nullable: true })
  pinCode: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  gstin: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  stateCode: string;

  @Column({ type: 'timestamp', nullable: true })
  validTill: Date;

  @CreateDateColumn()
  createdAt: Date;
}
