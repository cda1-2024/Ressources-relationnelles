import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: "localhost",
  port: Number(process.env.MARIADB_PORT),
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  entities: ["src/models/user.model.ts"],
  migrations: ['src/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});