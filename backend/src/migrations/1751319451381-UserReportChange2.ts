import { MigrationInterface, QueryRunner } from "typeorm";

export class UserReportChange21751319451381 implements MigrationInterface {
    name = 'UserReportChange21751319451381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_report\` CHANGE \`report_reason\` \`report_reason\` enum ('Spam', 'Harcèlement', 'Contenu inapproprié', 'Profil factice', 'Violation des conditions d’utilisation', 'Discours de haine', 'Arnaque', 'Autre') NOT NULL DEFAULT 'Autre'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_report\` CHANGE \`report_reason\` \`report_reason\` enum ('Spam', 'Harcèlement', 'Contenu inapproprié', 'Profil factice', 'Violation des conditions d’utilisation', 'Discours de haine', 'Arnaque', 'Autre') NULL`);
    }

}
