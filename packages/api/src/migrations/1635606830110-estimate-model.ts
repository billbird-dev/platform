import {MigrationInterface, QueryRunner} from "typeorm";

export class estimateModel1635606830110 implements MigrationInterface {
    name = 'estimateModel1635606830110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "estimate" ("id" SERIAL NOT NULL, "invoice_number" character varying(30) NOT NULL, "date" TIMESTAMP, "billing_address" text, "shipping_address" text, "gross_total" double precision NOT NULL DEFAULT '0', "discount" double precision NOT NULL DEFAULT '0', "net_amount" double precision NOT NULL DEFAULT '0', "items" jsonb DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, "customer_id" integer, CONSTRAINT "PK_75c20205845608fdb6725d7b130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "estimate" ADD CONSTRAINT "FK_8c846f3a2e17a70d4fbe3492be3" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estimate" ADD CONSTRAINT "FK_12641591006da25ae960fc590d4" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estimate" DROP CONSTRAINT "FK_12641591006da25ae960fc590d4"`);
        await queryRunner.query(`ALTER TABLE "estimate" DROP CONSTRAINT "FK_8c846f3a2e17a70d4fbe3492be3"`);
        await queryRunner.query(`DROP TABLE "estimate"`);
    }

}
