import { MigrationInterface, QueryRunner } from 'typeorm';

export class companyFieldsLengths1636423226327 implements MigrationInterface {
  name = 'companyFieldsLengths1636423226327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "UQ_816ea3a3cf946041637fb10df4c"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "username" character varying(200) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "UQ_816ea3a3cf946041637fb10df4c" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "UQ_6c81094d0ecc388287dfcd8caac"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "password" character varying(500) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "UQ_6c81094d0ecc388287dfcd8caac" UNIQUE ("password")`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying(500)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "email" character varying(500)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "branch"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "branch" character varying(200) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "city" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "state" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "gstin"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "gstin" character varying(500)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "state_code"`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD "state_code" character varying(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "state_code"`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD "state_code" character varying(10) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "gstin"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "gstin" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "state" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "city" character varying(5)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "branch"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "branch" character varying(50) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "email" character varying(254)`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying(100)`);
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "UQ_6c81094d0ecc388287dfcd8caac"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "password" character varying(128) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "UQ_6c81094d0ecc388287dfcd8caac" UNIQUE ("password")`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "UQ_816ea3a3cf946041637fb10df4c"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "username" character varying(150) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "UQ_816ea3a3cf946041637fb10df4c" UNIQUE ("username")`,
    );
  }
}
