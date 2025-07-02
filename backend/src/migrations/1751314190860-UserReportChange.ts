import { MigrationInterface, QueryRunner } from "typeorm";

export class UserReportChange1751314190860 implements MigrationInterface {
    name = 'UserReportChange1751314190860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP COLUMN \`ressource_type\``);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD \`report_reason\` enum ('Spam', 'Harcèlement', 'Contenu inapproprié', 'Profil factice', 'Violation des conditions d’utilisation', 'Discours de haine', 'Arnaque', 'Autre') NULL`);
        await queryRunner.query(`ALTER TABLE \`user_report\` CHANGE \`content\` \`content\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`user_report\` CHANGE \`moderator_view\` \`moderator_view\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_report\` CHANGE \`moderator_view\` \`moderator_view\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_report\` CHANGE \`content\` \`content\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP COLUMN \`report_reason\``);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD \`ressource_type\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user'`);
    }

}
