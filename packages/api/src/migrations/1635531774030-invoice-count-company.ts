import {MigrationInterface, QueryRunner} from "typeorm";

export class invoiceCountCompany1635531774030 implements MigrationInterface {
    name = 'invoiceCountCompany1635531774030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "sale_invoice_count" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "company" ADD "purchase_invoice_count" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "company" ADD "estimate_invoice_count" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "estimate_invoice_count"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "purchase_invoice_count"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "sale_invoice_count"`);
    }

}
