import { MigrationInterface, QueryRunner } from "typeorm";

export class UserReportChange31751322887099 implements MigrationInterface {
    name = 'UserReportChange31751322887099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP COLUMN \`created_at\``);
    }

}
