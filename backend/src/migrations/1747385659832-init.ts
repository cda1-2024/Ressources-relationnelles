import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1747385659832 implements MigrationInterface {
  name = 'Init1747385659832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`event_participation\` (\`user_id\` uuid NOT NULL, \`event_id\` uuid NOT NULL, \`date_time_participation\` datetime NOT NULL, \`win\` tinyint NOT NULL DEFAULT 0, \`score\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`user_id\`, \`event_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`event\` (\`id\` uuid NOT NULL, \`title\` varchar(100) NOT NULL, \`content\` longtext NOT NULL, \`is_restricted\` tinyint NOT NULL DEFAULT 0, \`suspended\` tinyint NOT NULL DEFAULT 0, \`deleted\` tinyint NOT NULL DEFAULT 0, \`event_type\` enum ('morpion', 'motus', 'sondage') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`manager_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`saved_ressource\` (\`user_id\` uuid NOT NULL, \`ressource_id\` uuid NOT NULL, \`is_favorite\` tinyint NOT NULL DEFAULT 0, \`is_to_later\` tinyint NOT NULL DEFAULT 0, \`like\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`user_id\`, \`ressource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`consulted_ressource\` (\`user_id\` uuid NOT NULL, \`ressource_id\` uuid NOT NULL, \`date_time_consult\` datetime NOT NULL, PRIMARY KEY (\`user_id\`, \`ressource_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_report\` (\`reporter_id\` uuid NOT NULL, \`reported_user_id\` uuid NOT NULL, \`content\` longtext NOT NULL, \`moderator_view\` longtext NOT NULL, \`is_resolved\` tinyint NOT NULL DEFAULT 0, \`ressource_type\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user', \`reported_comment_id\` uuid NULL, PRIMARY KEY (\`reporter_id\`, \`reported_user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` uuid NOT NULL, \`uuid_google\` varchar(100) NULL, \`email\` varchar(100) NOT NULL, \`username\` varchar(60) NOT NULL, \`bio\` varchar(1000) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL, \`banned\` tinyint NOT NULL DEFAULT 0, \`disabled\` tinyint NOT NULL DEFAULT 0, \`city\` varchar(100) NOT NULL DEFAULT '', \`region\` varchar(100) NOT NULL DEFAULT '', \`country\` varchar(100) NOT NULL DEFAULT '', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('superAdmin', 'admin', 'moderator', 'user', 'visitor') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_2e18f5946c50e060de6a7ad2bb\` (\`uuid_google\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` uuid NOT NULL, \`message\` longtext NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ressource_id\` uuid NULL, \`author_id\` uuid NULL, \`parent_comment_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ressource\` (\`id\` uuid NOT NULL, \`title\` varchar(100) NOT NULL, \`content_text\` longtext NOT NULL, \`content_link\` varchar(100) NULL, \`admin_validation\` tinyint NOT NULL DEFAULT 0, \`date_time_validation\` datetime NULL, \`ressource_type\` enum ('text', 'image', 'video', 'pdf') NOT NULL DEFAULT 'text', \`visibility\` enum ('restricted', 'public', 'private') NOT NULL DEFAULT 'private', \`status\` enum ('draft', 'toValidate', 'published', 'suspended', 'deleted') NOT NULL DEFAULT 'draft', \`like\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`category_id\` uuid NULL, \`creator_id\` uuid NULL, \`validator_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` uuid NOT NULL, \`name\` varchar(50) NOT NULL, \`icon_path\` varchar(100) NOT NULL, \`color\` varchar(20) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`last_author_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`searched_stats\` (\`search\` varchar(255) NOT NULL, \`user_id\` uuid NOT NULL, \`date_time_search\` datetime NOT NULL, PRIMARY KEY (\`search\`, \`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_participation\` ADD CONSTRAINT \`FK_64955c7dd0b473feb277778cea5\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_participation\` ADD CONSTRAINT \`FK_6726d52109b16c008e1f49bf78d\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_3c311f2b3d16197881082edee4e\` FOREIGN KEY (\`manager_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`saved_ressource\` ADD CONSTRAINT \`FK_4b1da706f300c29dc485ea6cb9d\` FOREIGN KEY (\`ressource_id\`) REFERENCES \`ressource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`saved_ressource\` ADD CONSTRAINT \`FK_09ec5cc4278081b96a62a1da737\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consulted_ressource\` ADD CONSTRAINT \`FK_8597ed611a3216242476a46c2c3\` FOREIGN KEY (\`ressource_id\`) REFERENCES \`ressource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consulted_ressource\` ADD CONSTRAINT \`FK_2d3ad0227240407513223b868a3\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_e1a59610dd446c038093fc9fa1f\` FOREIGN KEY (\`reported_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_dbee763adbfd464522d0f1bdc9a\` FOREIGN KEY (\`reporter_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_report\` ADD CONSTRAINT \`FK_d21ff5a153811d72c8dc2cdb25b\` FOREIGN KEY (\`reported_comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_a0a6a3211519daf72512b06691c\` FOREIGN KEY (\`ressource_id\`) REFERENCES \`ressource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_3ce66469b26697baa097f8da923\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_ac69bddf8202b7c0752d9dc8f32\` FOREIGN KEY (\`parent_comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ressource\` ADD CONSTRAINT \`FK_f5b072caad10c2bdecfcb6616fa\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ressource\` ADD CONSTRAINT \`FK_3e8671e158862f7cd85b550e8a0\` FOREIGN KEY (\`creator_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ressource\` ADD CONSTRAINT \`FK_a981c92f54afeeb9529eb2b8818\` FOREIGN KEY (\`validator_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_1e916bc3eb0ee23d68aed18aaf7\` FOREIGN KEY (\`last_author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_1e916bc3eb0ee23d68aed18aaf7\``);
    await queryRunner.query(`ALTER TABLE \`ressource\` DROP FOREIGN KEY \`FK_a981c92f54afeeb9529eb2b8818\``);
    await queryRunner.query(`ALTER TABLE \`ressource\` DROP FOREIGN KEY \`FK_3e8671e158862f7cd85b550e8a0\``);
    await queryRunner.query(`ALTER TABLE \`ressource\` DROP FOREIGN KEY \`FK_f5b072caad10c2bdecfcb6616fa\``);
    await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_ac69bddf8202b7c0752d9dc8f32\``);
    await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_3ce66469b26697baa097f8da923\``);
    await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_a0a6a3211519daf72512b06691c\``);
    await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_d21ff5a153811d72c8dc2cdb25b\``);
    await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_dbee763adbfd464522d0f1bdc9a\``);
    await queryRunner.query(`ALTER TABLE \`user_report\` DROP FOREIGN KEY \`FK_e1a59610dd446c038093fc9fa1f\``);
    await queryRunner.query(`ALTER TABLE \`consulted_ressource\` DROP FOREIGN KEY \`FK_2d3ad0227240407513223b868a3\``);
    await queryRunner.query(`ALTER TABLE \`consulted_ressource\` DROP FOREIGN KEY \`FK_8597ed611a3216242476a46c2c3\``);
    await queryRunner.query(`ALTER TABLE \`saved_ressource\` DROP FOREIGN KEY \`FK_09ec5cc4278081b96a62a1da737\``);
    await queryRunner.query(`ALTER TABLE \`saved_ressource\` DROP FOREIGN KEY \`FK_4b1da706f300c29dc485ea6cb9d\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_3c311f2b3d16197881082edee4e\``);
    await queryRunner.query(`ALTER TABLE \`event_participation\` DROP FOREIGN KEY \`FK_6726d52109b16c008e1f49bf78d\``);
    await queryRunner.query(`ALTER TABLE \`event_participation\` DROP FOREIGN KEY \`FK_64955c7dd0b473feb277778cea5\``);
    await queryRunner.query(`DROP TABLE \`searched_stats\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`ressource\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_2e18f5946c50e060de6a7ad2bb\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`user_report\``);
    await queryRunner.query(`DROP TABLE \`consulted_ressource\``);
    await queryRunner.query(`DROP TABLE \`saved_ressource\``);
    await queryRunner.query(`DROP TABLE \`event\``);
    await queryRunner.query(`DROP TABLE \`event_participation\``);
  }
}
