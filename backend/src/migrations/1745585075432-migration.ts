import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745585075432 implements MigrationInterface {
    name = 'Migration1745585075432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Event_Participations\` (\`user_id\` uuid NOT NULL, \`event_id\` uuid NOT NULL, \`date_time_participation\` datetime NOT NULL, \`win\` tinyint NOT NULL DEFAULT 0, \`score\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`user_id\`, \`event_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Events\` (\`id\` uuid NOT NULL, \`title\` varchar(100) NOT NULL, \`content\` longtext NOT NULL, \`is_restricted\` tinyint NOT NULL DEFAULT 0, \`suspended\` tinyint NOT NULL DEFAULT 0, \`deleted\` tinyint NOT NULL DEFAULT 0, \`event_type\` enum ('morpion', 'motus', 'sondage') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`manager_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Saved_Ressources\` (\`user_id\` uuid NOT NULL, \`ressource_id\` uuid NOT NULL, \`is_favorite\` tinyint NOT NULL DEFAULT 0, \`is_to_later\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`user_id\`, \`ressource_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Consulted_Ressources\` (\`user_id\` uuid NOT NULL, \`ressource_id\` uuid NOT NULL, \`date_time_consult\` datetime NOT NULL, PRIMARY KEY (\`user_id\`, \`ressource_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User_Report\` (\`reporter_id\` uuid NOT NULL, \`reported_user_id\` uuid NOT NULL, \`content\` longtext NOT NULL, \`moderator_view\` longtext NOT NULL, \`is_resolved\` tinyint NOT NULL DEFAULT 0, \`ressource_type\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user', \`reported_comment_id\` uuid NULL, PRIMARY KEY (\`reporter_id\`, \`reported_user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id\` uuid NOT NULL, \`uuid_google\` varchar(100) NULL, \`email\` varchar(100) NOT NULL, \`username\` varchar(60) NOT NULL, \`password\` varchar(255) NOT NULL, \`banned\` tinyint NOT NULL DEFAULT 0, \`disabled\` tinyint NOT NULL DEFAULT 0, \`city\` varchar(100) NOT NULL DEFAULT '', \`region\` varchar(100) NOT NULL DEFAULT '', \`country\` varchar(100) NOT NULL DEFAULT '', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_72c8c13cb0d4ecca0029e37ea3\` (\`uuid_google\`), UNIQUE INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` (\`email\`), UNIQUE INDEX \`IDX_ffc81a3b97dcbf8e320d5106c0\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Comments\` (\`id\` uuid NOT NULL, \`message\` longtext NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ressource_id\` uuid NULL, \`autor_id\` uuid NULL, \`parent_comment_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Ressources\` (\`id\` uuid NOT NULL, \`title\` varchar(100) NOT NULL, \`content_text\` longtext NOT NULL, \`content_link\` varchar(100) NULL, \`admin_validation\` tinyint NOT NULL DEFAULT 0, \`date_time_validation\` datetime NULL, \`ressource_type\` enum ('text', 'image', 'video', 'pdf') NOT NULL DEFAULT 'text', \`visibility\` enum ('restricted', 'public', 'private') NOT NULL DEFAULT 'private', \`state\` enum ('draft', 'toValidate', 'published', 'suspended', 'deleted') NOT NULL DEFAULT 'draft', \`like\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`category_id\` uuid NULL, \`creator_id\` uuid NULL, \`validator_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Categories\` (\`id\` uuid NOT NULL, \`name\` varchar(50) NOT NULL, \`icon_path\` varchar(100) NOT NULL, \`color\` varchar(20) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`last_autor_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Search_Stats\` (\`search\` varchar(255) NOT NULL, \`user_id\` uuid NOT NULL, \`date_time_search\` datetime NOT NULL, PRIMARY KEY (\`search\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Event_Participations\` ADD CONSTRAINT \`FK_5f1bcb5fe552c7ab51637eb47d4\` FOREIGN KEY (\`event_id\`) REFERENCES \`Events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Event_Participations\` ADD CONSTRAINT \`FK_13494ad9d46913b3c459cfe21b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Events\` ADD CONSTRAINT \`FK_a1fc03da1c559730c0df646c89a\` FOREIGN KEY (\`manager_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Saved_Ressources\` ADD CONSTRAINT \`FK_377489601e3425495834c8a87f9\` FOREIGN KEY (\`ressource_id\`) REFERENCES \`Ressources\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Saved_Ressources\` ADD CONSTRAINT \`FK_d215f227e72fe484f93974e12ee\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Consulted_Ressources\` ADD CONSTRAINT \`FK_c10aa5dc04d7984089d2b6a548a\` FOREIGN KEY (\`ressource_id\`) REFERENCES \`Ressources\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Consulted_Ressources\` ADD CONSTRAINT \`FK_3fce7a606ed308cd78947a80f9b\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`User_Report\` ADD CONSTRAINT \`FK_7cfbeb823823714cba19ad8d457\` FOREIGN KEY (\`reported_user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`User_Report\` ADD CONSTRAINT \`FK_7997c87e603e4a833394124c262\` FOREIGN KEY (\`reporter_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`User_Report\` ADD CONSTRAINT \`FK_a960f8a5cbeec0d0f8ba48bb387\` FOREIGN KEY (\`reported_comment_id\`) REFERENCES \`Comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_55426d278e056fbdceba8a183fb\` FOREIGN KEY (\`ressource_id\`) REFERENCES \`Ressources\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_5ba22e6cf1b6e58fadb1b969730\` FOREIGN KEY (\`autor_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_02a8350f05c7707821b88dd9c10\` FOREIGN KEY (\`parent_comment_id\`) REFERENCES \`Comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ressources\` ADD CONSTRAINT \`FK_c30321361cba1763e22cff30ce2\` FOREIGN KEY (\`category_id\`) REFERENCES \`Categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ressources\` ADD CONSTRAINT \`FK_79c05053cb3cbb9db46a0dd0a0c\` FOREIGN KEY (\`creator_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ressources\` ADD CONSTRAINT \`FK_6263aa481b3f1c7f9860d8390e2\` FOREIGN KEY (\`validator_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Categories\` ADD CONSTRAINT \`FK_e0710e25386ff78c15db64fe6b4\` FOREIGN KEY (\`last_autor_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Categories\` DROP FOREIGN KEY \`FK_e0710e25386ff78c15db64fe6b4\``);
        await queryRunner.query(`ALTER TABLE \`Ressources\` DROP FOREIGN KEY \`FK_6263aa481b3f1c7f9860d8390e2\``);
        await queryRunner.query(`ALTER TABLE \`Ressources\` DROP FOREIGN KEY \`FK_79c05053cb3cbb9db46a0dd0a0c\``);
        await queryRunner.query(`ALTER TABLE \`Ressources\` DROP FOREIGN KEY \`FK_c30321361cba1763e22cff30ce2\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_02a8350f05c7707821b88dd9c10\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_5ba22e6cf1b6e58fadb1b969730\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_55426d278e056fbdceba8a183fb\``);
        await queryRunner.query(`ALTER TABLE \`User_Report\` DROP FOREIGN KEY \`FK_a960f8a5cbeec0d0f8ba48bb387\``);
        await queryRunner.query(`ALTER TABLE \`User_Report\` DROP FOREIGN KEY \`FK_7997c87e603e4a833394124c262\``);
        await queryRunner.query(`ALTER TABLE \`User_Report\` DROP FOREIGN KEY \`FK_7cfbeb823823714cba19ad8d457\``);
        await queryRunner.query(`ALTER TABLE \`Consulted_Ressources\` DROP FOREIGN KEY \`FK_3fce7a606ed308cd78947a80f9b\``);
        await queryRunner.query(`ALTER TABLE \`Consulted_Ressources\` DROP FOREIGN KEY \`FK_c10aa5dc04d7984089d2b6a548a\``);
        await queryRunner.query(`ALTER TABLE \`Saved_Ressources\` DROP FOREIGN KEY \`FK_d215f227e72fe484f93974e12ee\``);
        await queryRunner.query(`ALTER TABLE \`Saved_Ressources\` DROP FOREIGN KEY \`FK_377489601e3425495834c8a87f9\``);
        await queryRunner.query(`ALTER TABLE \`Events\` DROP FOREIGN KEY \`FK_a1fc03da1c559730c0df646c89a\``);
        await queryRunner.query(`ALTER TABLE \`Event_Participations\` DROP FOREIGN KEY \`FK_13494ad9d46913b3c459cfe21b6\``);
        await queryRunner.query(`ALTER TABLE \`Event_Participations\` DROP FOREIGN KEY \`FK_5f1bcb5fe552c7ab51637eb47d4\``);
        await queryRunner.query(`DROP TABLE \`Search_Stats\``);
        await queryRunner.query(`DROP TABLE \`Categories\``);
        await queryRunner.query(`DROP TABLE \`Ressources\``);
        await queryRunner.query(`DROP TABLE \`Comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_ffc81a3b97dcbf8e320d5106c0\` ON \`Users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` ON \`Users\``);
        await queryRunner.query(`DROP INDEX \`IDX_72c8c13cb0d4ecca0029e37ea3\` ON \`Users\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(`DROP TABLE \`User_Report\``);
        await queryRunner.query(`DROP TABLE \`Consulted_Ressources\``);
        await queryRunner.query(`DROP TABLE \`Saved_Ressources\``);
        await queryRunner.query(`DROP TABLE \`Events\``);
        await queryRunner.query(`DROP TABLE \`Event_Participations\``);
    }

}
