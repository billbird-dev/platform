import {MigrationInterface, QueryRunner} from "typeorm";

export class init1635443276668 implements MigrationInterface {
    name = 'init1635443276668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "username" character varying(150) NOT NULL, "password" character varying(128) NOT NULL, "name" character varying(100), "email" character varying(254), "phone" bigint NOT NULL, "is_premium_member" boolean NOT NULL DEFAULT false, "is_parent" boolean NOT NULL DEFAULT false, "branch" character varying(50) NOT NULL, "address" text, "city" character varying(5), "state" character varying(50), "pinCode" integer, "gstin" character varying(255), "state_code" character varying(10) NOT NULL, "valid_till" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "current_hashed_refresh_token" text, "parent_id" integer, CONSTRAINT "UQ_816ea3a3cf946041637fb10df4c" UNIQUE ("username"), CONSTRAINT "UQ_6c81094d0ecc388287dfcd8caac" UNIQUE ("password"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" text, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "email" character varying(254), "phone" bigint NOT NULL, "gstin" character varying(30) NOT NULL, "billing_address" text, "shipping_address" text, "registered_gst_member" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "code" character varying(50), "name" character varying(50) NOT NULL, "brand" character varying(50) NOT NULL, "description" text, "rate" double precision NOT NULL DEFAULT '0', "hsn_code" character varying(50), "quantity" integer NOT NULL DEFAULT '0', "unit" character varying(10) NOT NULL DEFAULT 'pcs', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale" ("id" SERIAL NOT NULL, "invoice_number" character varying(30) NOT NULL, "date" TIMESTAMP, "billing_address" text, "shipping_address" text, "gross_total" double precision NOT NULL DEFAULT '0', "discount" double precision NOT NULL DEFAULT '0', "taxable_amount" double precision NOT NULL DEFAULT '0', "cgst_percent" double precision NOT NULL DEFAULT '0', "sgst_percent" double precision NOT NULL DEFAULT '0', "igst_percent" double precision NOT NULL DEFAULT '0', "cgst_value" double precision NOT NULL DEFAULT '0', "sgst_value" double precision NOT NULL DEFAULT '0', "igst_value" double precision NOT NULL DEFAULT '0', "net_amount" double precision NOT NULL DEFAULT '0', "data" jsonb DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, "customer_id" integer, CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_7aa27445a1d4002dc9df5f18cc3" FOREIGN KEY ("parent_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_170a73f2523d7ca266834e38ef1" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_a0503db1630a5b8a4d7deabd556" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_87c91a438fc4eaa187776b18a6e" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_89809b48d46cc3eae0565c016e4" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_89809b48d46cc3eae0565c016e4"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_87c91a438fc4eaa187776b18a6e"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_a0503db1630a5b8a4d7deabd556"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_170a73f2523d7ca266834e38ef1"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_7aa27445a1d4002dc9df5f18cc3"`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
