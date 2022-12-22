import { MigrationInterface, QueryRunner } from 'typeorm';

export class userpassword1671698665703 implements MigrationInterface {
  transaction: true;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" Add "password" varchar NOT NULL `
    );
    await queryRunner.query(
      `ALTER TABLE "user" Add "deleted_at" timestamp NULL `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" Drop "password"  `);
    await queryRunner.query(`ALTER TABLE "user" Drop "deleted_at"  `);
  }
}
