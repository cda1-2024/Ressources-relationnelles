import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRefreshToken1748435523953 implements MigrationInterface {
    name = 'UpdateRefreshToken1748435523953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(100) NOT NULL DEFAULT ''`);
    }

}
