import * as dotenv from 'dotenv';
import { Category } from 'src/models/category.model';
import { Event } from 'src/models/event.model';
import { EventType } from 'src/models/eventType.model';
import { Ressource } from 'src/models/ressource.model';
import { RessourceType } from 'src/models/ressourceType.model';
import { User } from 'src/models/user.model';
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
  entities: [User, Category, Comment, Event, EventType, Ressource, RessourceType],
  migrations: ['src/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});