import {MigrationInterface, QueryRunner} from "typeorm";

export class saleItemsColumnName1635443886987 implements MigrationInterface {
    name = 'saleItemsColumnName1635443886987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" RENAME COLUMN "data" TO "items"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" RENAME COLUMN "items" TO "data"`);
    }

}
