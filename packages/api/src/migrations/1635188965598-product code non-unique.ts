import {MigrationInterface, QueryRunner} from "typeorm";

export class productCodeNonUnique1635188965598 implements MigrationInterface {
    name = 'productCodeNonUnique1635188965598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code")`);
    }

}
