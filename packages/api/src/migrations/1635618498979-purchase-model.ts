import { MigrationInterface, QueryRunner } from 'typeorm';

export class purchaseModel1635618498979 implements MigrationInterface {
  name = 'purchaseModel1635618498979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "invoice_number" character varying(30) NOT NULL, "date" TIMESTAMP, "gross_total" double precision NOT NULL DEFAULT '0', "discount" double precision NOT NULL DEFAULT '0', "taxable_amount" double precision NOT NULL DEFAULT '0', "cgst_percent" double precision NOT NULL DEFAULT '0', "sgst_percent" double precision NOT NULL DEFAULT '0', "igst_percent" double precision NOT NULL DEFAULT '0', "cgst_value" double precision NOT NULL DEFAULT '0', "sgst_value" double precision NOT NULL DEFAULT '0', "igst_value" double precision NOT NULL DEFAULT '0', "net_amount" double precision NOT NULL DEFAULT '0', "items" jsonb DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, "supplier_id" integer, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_91610731c6e386d62e4a3e17ed6" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_8d9a856657c46725d085c73e4fc" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase" DROP CONSTRAINT "FK_8d9a856657c46725d085c73e4fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" DROP CONSTRAINT "FK_91610731c6e386d62e4a3e17ed6"`,
    );
    await queryRunner.query(`DROP TABLE "purchase"`);
  }
}
