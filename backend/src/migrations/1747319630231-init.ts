import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1747319630231 implements MigrationInterface {
    name = 'Init1747319630231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_participation\` (\`userId\` uuid NOT NULL, \`eventId\` uuid NOT NULL, \`dateTimeParticipation\` datetime NOT NULL, \`win\` tinyint NOT NULL DEFAULT 0, \`score\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`userId\`, \`eventId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` uuid NOT NULL, \`title\` varchar(100) NOT NULL, \`content\` longtext NOT NULL, \`isRestricted\` tinyint NOT NULL DEFAULT 0, \`suspended\` tinyint NOT NULL DEFAULT 0, \`deleted\` tinyint NOT NULL DEFAULT 0, \`eventType\` enum ('morpion', 'motus', 'sondage') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`managerId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`saved_ressource\` (\`userId\` uuid NOT NULL, \`ressourceId\` uuid NOT NULL, \`isFavorite\` tinyint NOT NULL DEFAULT 0, \`isToLater\` tinyint NOT NULL DEFAULT 0, \`like\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`userId\`, \`ressourceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`consulted_ressource\` (\`userId\` uuid NOT NULL, \`ressourceId\` uuid NOT NULL, \`dateTimeConsult\` datetime NOT NULL, PRIMARY KEY (\`userId\`, \`ressourceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_report\` (\`reporterId\` uuid NOT NULL, \`reportedUserId\` uuid NOT NULL, \`content\` longtext NOT NULL, \`moderatorView\` longtext NOT NULL, \`isResolved\` tinyint NOT NULL DEFAULT 0, \`ressourceType\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user', \`reportedCommentId\` uuid NULL, PRIMARY KEY (\`reporterId\`, \`reportedUserId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` uuid NOT NULL, \`uuidGoogle\` varchar(100) NULL, \`email\` varchar(100) NOT NULL, \`username\` varchar(60) NOT NULL, \`bio\` varchar(1000) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL, \`banned\` tinyint NOT NULL DEFAULT 0, \`disabled\` tinyint NOT NULL DEFAULT 0, \`city\` varchar(100) NOT NULL DEFAULT '', \`region\` varchar(100) NOT NULL DEFAULT '', \`country\` varchar(100) NOT NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_f1fd327685ea057a0cb9b67a60\` (\`uuidGoogle\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` uuid NOT NULL, \`message\` longtext NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ressourceId\` uuid NULL, \`authorId\` uuid NULL, \`parentCommentId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ressource\` (\`id\` uuid NOT NULL, \`title\` varchar(100) NOT NULL, \`contentText\` longtext NOT NULL, \`contentLink\` varchar(100) NULL, \`adminValidation\` tinyint NOT NULL DEFAULT 0, \`dateTimeValidation\` datetime NULL, \`ressourceType\` enum ('text', 'image', 'video', 'pdf') NOT NULL DEFAULT 'text', \`visibility\` enum ('restricted', 'public', 'private') NOT NULL DEFAULT 'private', \`status\` enum ('draft', 'toValidate', 'published', 'suspended', 'deleted') NOT NULL DEFAULT 'draft', \`like\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`categoryId\` uuid NULL, \`creatorId\` uuid NULL, \`validatorId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` uuid NOT NULL, \`name\` varchar(50) NOT NULL, \`iconPath\` varchar(100) NOT NULL, \`color\` varchar(20) NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastAuthorId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`searched_stats\` (\`search\` varchar(255) NOT NULL, \`userId\` uuid NOT NULL, \`dateTimeSearch\` datetime NOT NULL, PRIMARY KEY (\`search\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`event_participation\` ADD CONSTRAINT \`FK_f30c26df0e032cbe0b2e2eee909\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_participation\` ADD CONSTRAINT \`FK_7f8c3f24f237bce73c832440340\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_e078704607b358c8a68b8a5aae8\` FOREIGN KEY (\`managerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_ressource\` ADD CONSTRAINT \`FK_730470b9048e4aaa34fe88aa22d\` FOREIGN KEY (\`ressourceId\`) REFERENCES \`ressource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_ressource\` ADD CONSTRAINT \`FK_4716e2643412eb85ecfdb7ae992\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulted_ressource\` ADD CONSTRAINT \`FK_7cf9e05c35b1fa7d199d4ddd463\` FOREIGN KEY (\`ressourceId\`) REFERENCES \`ressource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulted_ressource\` ADD CONSTRAINT \`FK_baca6dfcc1edf4f819895d471fe\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_2d3711064572aa0203cba01242b\` FOREIGN KEY (\`reportedUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_142ad20f8e4e5385b548940b62c\` FOREIGN KEY (\`reporterId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_be80804c65edf58b68262f0b23d\` FOREIGN KEY (\`reportedCommentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_aaecfc526c7a2134582ea823aed\` FOREIGN KEY (\`ressourceId\`) REFERENCES \`ressource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_73aac6035a70c5f0313c939f237\` FOREIGN KEY (\`parentCommentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ressource\` ADD CONSTRAINT \`FK_cc9fbca6f1d982cf4da0c590c19\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ressource\` ADD CONSTRAINT \`FK_ab0d4f7f9b14a8f61d25e82797f\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ressource\` ADD CONSTRAINT \`FK_61ccbf88dd9ffe3eb61710aaf1a\` FOREIGN KEY (\`validatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_5916e87be10a3c74d039b031f68\` FOREIGN KEY (\`lastAuthorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_5916e87be10a3c74d039b031f68\``);
        await queryRunner.query(`ALTER TABLE \`ressource\` DROP FOREIGN KEY \`FK_61ccbf88dd9ffe3eb61710aaf1a\``);
        await queryRunner.query(`ALTER TABLE \`ressource\` DROP FOREIGN KEY \`FK_ab0d4f7f9b14a8f61d25e82797f\``);
        await queryRunner.query(`ALTER TABLE \`ressource\` DROP FOREIGN KEY \`FK_cc9fbca6f1d982cf4da0c590c19\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_73aac6035a70c5f0313c939f237\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_aaecfc526c7a2134582ea823aed\``);
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_be80804c65edf58b68262f0b23d\``);
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_142ad20f8e4e5385b548940b62c\``);
        await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_2d3711064572aa0203cba01242b\``);
        await queryRunner.query(`ALTER TABLE \`consulted_ressource\` DROP FOREIGN KEY \`FK_baca6dfcc1edf4f819895d471fe\``);
        await queryRunner.query(`ALTER TABLE \`consulted_ressource\` DROP FOREIGN KEY \`FK_7cf9e05c35b1fa7d199d4ddd463\``);
        await queryRunner.query(`ALTER TABLE \`saved_ressource\` DROP FOREIGN KEY \`FK_4716e2643412eb85ecfdb7ae992\``);
        await queryRunner.query(`ALTER TABLE \`saved_ressource\` DROP FOREIGN KEY \`FK_730470b9048e4aaa34fe88aa22d\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_e078704607b358c8a68b8a5aae8\``);
        await queryRunner.query(`ALTER TABLE \`event_participation\` DROP FOREIGN KEY \`FK_7f8c3f24f237bce73c832440340\``);
        await queryRunner.query(`ALTER TABLE \`event_participation\` DROP FOREIGN KEY \`FK_f30c26df0e032cbe0b2e2eee909\``);
        await queryRunner.query(`DROP TABLE \`searched_stats\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`ressource\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_f1fd327685ea057a0cb9b67a60\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`user_report\``);
        await queryRunner.query(`DROP TABLE \`consulted_ressource\``);
        await queryRunner.query(`DROP TABLE \`saved_ressource\``);
        await queryRunner.query(`DROP TABLE \`event\``);
        await queryRunner.query(`DROP TABLE \`event_participation\``);
    }

}
