import {MigrationInterface, QueryRunner} from "typeorm";

export class supplierModel1635614733059 implements MigrationInterface {
    name = 'supplierModel1635614733059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "supplier" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "email" character varying(254), "phone" bigint NOT NULL, "gstin" character varying(30) NOT NULL, "address" text, "registered_gst_member" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "supplier" ADD CONSTRAINT "FK_3e3ed41fe5a4f5ea801e2e55dad" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supplier" DROP CONSTRAINT "FK_3e3ed41fe5a4f5ea801e2e55dad"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
    }

}
