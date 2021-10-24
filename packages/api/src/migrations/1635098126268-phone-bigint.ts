import {MigrationInterface, QueryRunner} from "typeorm";

export class phoneBigint1635098126268 implements MigrationInterface {
    name = 'phoneBigint1635098126268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "phone" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "phone" integer NOT NULL`);
    }

}
