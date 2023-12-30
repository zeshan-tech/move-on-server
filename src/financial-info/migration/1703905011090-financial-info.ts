import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinancialInfo1703905011090 implements MigrationInterface {
  name = 'FinancialInfo1703905011090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`financial_info\` (\`ID\` varchar(36) NOT NULL, \`created_at\` bigint NOT NULL, \`updated_at\` bigint NULL, \`deleted_at\` bigint NULL, \`net_profit\` decimal(3,1) NOT NULL DEFAULT '0.0', \`budget\` decimal(3,1) NOT NULL DEFAULT '0.0', \`revenue\` decimal(3,1) NOT NULL DEFAULT '0.0', \`movie_id\` varchar(36) NULL, \`series_id\` varchar(36) NULL, UNIQUE INDEX \`REL_579357061e6e1f2c6c76a58250\` (\`movie_id\`), UNIQUE INDEX \`REL_874bf2bc5fde4fbd63cb2eca66\` (\`series_id\`), PRIMARY KEY (\`ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`financial_info\` ADD CONSTRAINT \`FK_579357061e6e1f2c6c76a582504\` FOREIGN KEY (\`movie_id\`) REFERENCES \`movie\`(\`ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`financial_info\` ADD CONSTRAINT \`FK_874bf2bc5fde4fbd63cb2eca667\` FOREIGN KEY (\`series_id\`) REFERENCES \`series\`(\`ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`financial_info\` DROP FOREIGN KEY \`FK_874bf2bc5fde4fbd63cb2eca667\``);
    await queryRunner.query(`ALTER TABLE \`financial_info\` DROP FOREIGN KEY \`FK_579357061e6e1f2c6c76a582504\``);
    await queryRunner.query(`DROP TABLE \`financial_info\``);
  }
}
