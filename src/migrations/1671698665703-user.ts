import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1671698665703 implements MigrationInterface {
  transaction: true;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" Add "deleted_at" timestamp NULL `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" Drop "deleted_at"  `);
  }
}
