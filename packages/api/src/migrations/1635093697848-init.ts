import {MigrationInterface, QueryRunner} from "typeorm";

export class init1635093697848 implements MigrationInterface {
    name = 'init1635093697848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "username" character varying(150) NOT NULL, "password" character varying(128) NOT NULL, "name" character varying(100), "email" character varying(254), "phone" integer NOT NULL, "isPremiumMember" boolean NOT NULL DEFAULT false, "isParent" boolean NOT NULL DEFAULT false, "branch" character varying(50) NOT NULL, "address" text, "city" character varying(5), "state" character varying(50), "pinCode" integer, "gstin" character varying(255), "stateCode" character varying(10) NOT NULL, "validTill" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "parentId" integer, CONSTRAINT "UQ_816ea3a3cf946041637fb10df4c" UNIQUE ("username"), CONSTRAINT "UQ_6c81094d0ecc388287dfcd8caac" UNIQUE ("password"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" text, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_58d280bd19fd40abeba89a59eb9" FOREIGN KEY ("parentId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_58d280bd19fd40abeba89a59eb9"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
