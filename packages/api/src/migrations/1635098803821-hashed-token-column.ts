import {MigrationInterface, QueryRunner} from "typeorm";

export class hashedTokenColumn1635098803821 implements MigrationInterface {
    name = 'hashedTokenColumn1635098803821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "currentHashedRefreshToken" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "currentHashedRefreshToken"`);
    }

}
