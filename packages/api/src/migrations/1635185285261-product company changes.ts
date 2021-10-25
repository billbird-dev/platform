import {MigrationInterface, QueryRunner} from "typeorm";

export class productCompanyChanges1635185285261 implements MigrationInterface {
    name = 'productCompanyChanges1635185285261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "brand" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "name" DROP NOT NULL`);
    }

}
