import {MigrationInterface, QueryRunner} from "typeorm";

export class salePurchasePrefModel1635621452547 implements MigrationInterface {
    name = 'salePurchasePrefModel1635621452547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase_preferences" ("id" SERIAL NOT NULL, "cgst_percent" double precision NOT NULL DEFAULT '0', "sgst_percent" double precision NOT NULL DEFAULT '0', "igst_percent" double precision NOT NULL DEFAULT '0', "discount_percent" double precision NOT NULL DEFAULT '0', "company_id" integer, CONSTRAINT "PK_272b63959dec06f48874691f91e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_preferences" ("id" SERIAL NOT NULL, "cgst_percent" double precision NOT NULL DEFAULT '0', "sgst_percent" double precision NOT NULL DEFAULT '0', "igst_percent" double precision NOT NULL DEFAULT '0', "discount_percent" double precision NOT NULL DEFAULT '0', "company_id" integer, CONSTRAINT "PK_93656b3ef9371aaf012099859d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase_preferences" ADD CONSTRAINT "FK_b5ea0ebd3427de0436af5ebfb59" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_preferences" ADD CONSTRAINT "FK_45c39903d89dc7a74821274bfb0" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_preferences" DROP CONSTRAINT "FK_45c39903d89dc7a74821274bfb0"`);
        await queryRunner.query(`ALTER TABLE "purchase_preferences" DROP CONSTRAINT "FK_b5ea0ebd3427de0436af5ebfb59"`);
        await queryRunner.query(`DROP TABLE "sale_preferences"`);
        await queryRunner.query(`DROP TABLE "purchase_preferences"`);
    }

}
