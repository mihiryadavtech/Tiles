import { MigrationInterface, QueryRunner } from 'typeorm';

export class companypassword21671692367160 implements MigrationInterface {
  transaction: true;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" Add "password" varchar NOT NULL `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" Drop "password"  `);
  }
}
