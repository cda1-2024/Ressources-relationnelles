import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1747385385822 implements MigrationInterface {
    name = 'Init1747385385822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`deleted\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
    }

}
