import {MigrationInterface, QueryRunner} from "typeorm";

export class transactionsModel1635624287226 implements MigrationInterface {
    name = 'transactionsModel1635624287226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "date" TIMESTAMP DEFAULT now(), "debit" double precision DEFAULT '0', "credit" double precision DEFAULT '0', "company_id" integer, "sale_id" integer, "purchase_id" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_8733562c5e54c31dd1ba8f49915" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6b5bb39ba7ecca1bb45cafd1eed" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_c62e594014201fbc3d61cb311e3" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_c62e594014201fbc3d61cb311e3"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6b5bb39ba7ecca1bb45cafd1eed"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_8733562c5e54c31dd1ba8f49915"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
