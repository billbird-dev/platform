import {MigrationInterface, QueryRunner} from "typeorm";

export class customerModelManyCompany1635353802886 implements MigrationInterface {
    name = 'customerModelManyCompany1635353802886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "companyId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_a9d874b83a7879be8538bf08b09" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_a9d874b83a7879be8538bf08b09"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "companyId"`);
    }

}
