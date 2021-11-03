import { MigrationInterface, QueryRunner } from 'typeorm';

export class customerSupplierPhoneText1635952142610 implements MigrationInterface {
  name = 'customerSupplierPhoneText1635952142610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "customer" ADD "phone" text`);
    await queryRunner.query(`ALTER TABLE "supplier" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "supplier" ADD "phone" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "supplier" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "supplier" ADD "phone" bigint NOT NULL`);
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "customer" ADD "phone" bigint NOT NULL`);
  }
}
