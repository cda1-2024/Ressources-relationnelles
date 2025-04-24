import * as dotenv from 'dotenv';
import { Category } from '../models/category.model';
import { Comment } from '../models/comment.model';
import { ConsultedRessource } from '../models/consultedRessource.model';
import { Event } from '../models/event.model';
import { EventParticipation } from '../models/eventParticipation.model';
import { Ressource } from '../models/ressource.model';
import { SavedRessource } from '../models/savedRessource.model';
import { User } from '../models/user.model';
import { UserReport } from '../models/userReport.model';
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
  entities: [User, Category, Comment, Event, Ressource, SavedRessource, ConsultedRessource, UserReport, EventParticipation],
  migrations: ['src/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});