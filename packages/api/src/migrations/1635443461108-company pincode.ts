import {MigrationInterface, QueryRunner} from "typeorm";

export class companyPincode1635443461108 implements MigrationInterface {
    name = 'companyPincode1635443461108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" RENAME COLUMN "pinCode" TO "pincode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" RENAME COLUMN "pincode" TO "pinCode"`);
    }

}
