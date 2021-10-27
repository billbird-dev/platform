import {MigrationInterface, QueryRunner} from "typeorm";

export class customerModel1635353627676 implements MigrationInterface {
    name = 'customerModel1635353627676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "email" character varying(254), "phone" bigint NOT NULL, "gstin" character varying(30) NOT NULL, "billingAddress" text, "shippingAddress" text, "registeredGstMember" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
