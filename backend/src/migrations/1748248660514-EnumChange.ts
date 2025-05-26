import { MigrationInterface, QueryRunner } from "typeorm";

export class EnumChange1748248660514 implements MigrationInterface {
    name = 'EnumChange1748248660514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('Super Administrateur', 'Administrateur', 'Modérateur', 'Utilisateur', 'Visiteur') NOT NULL DEFAULT 'Utilisateur'`);
        await queryRunner.query(`ALTER TABLE \`ressource\` CHANGE \`ressource_type\` \`ressource_type\` enum ('Texte', 'Image', 'Vidéo', 'PDF') NOT NULL DEFAULT 'Texte'`);
        await queryRunner.query(`ALTER TABLE \`ressource\` CHANGE \`visibility\` \`visibility\` enum ('Restreinte', 'Publique', 'Privée') NOT NULL DEFAULT 'Privée'`);
        await queryRunner.query(`ALTER TABLE \`ressource\` CHANGE \`status\` \`status\` enum ('Brouillon', 'A valider', 'Publiée', 'Suspendue', 'Supprimée') NOT NULL DEFAULT 'Brouillon'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ressource\` CHANGE \`status\` \`status\` enum ('draft', 'toValidate', 'published', 'suspended', 'deleted') NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE \`ressource\` CHANGE \`visibility\` \`visibility\` enum ('restricted', 'public', 'private') NOT NULL DEFAULT 'private'`);
        await queryRunner.query(`ALTER TABLE \`ressource\` CHANGE \`ressource_type\` \`ressource_type\` enum ('text', 'image', 'video', 'pdf') NOT NULL DEFAULT 'text'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user'`);
    }

}
