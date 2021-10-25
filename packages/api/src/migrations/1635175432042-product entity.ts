import {MigrationInterface, QueryRunner} from "typeorm";

export class productEntity1635175432042 implements MigrationInterface {
    name = 'productEntity1635175432042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "code" character varying(50), "name" character varying(50), "brand" character varying(50), "description" text, "rate" double precision NOT NULL DEFAULT '0', "hsnCode" character varying(50), "quantity" integer NOT NULL DEFAULT '0', "unit" character varying(10) NOT NULL DEFAULT 'pcs', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_a331e634b87a7dbba2e7fccce19" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_a331e634b87a7dbba2e7fccce19"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
