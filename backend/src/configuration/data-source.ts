import * as dotenv from 'dotenv';
import { Category } from 'src/models/category.model';
import { Comment } from 'src/models/comment.model';
import { ConsultedRessource } from 'src/models/consultedRessource.model';
import { Event } from 'src/models/event.model';
import { EventParticipation } from 'src/models/eventParticipation.model';
import { Ressource } from 'src/models/ressource.model';
import { SavedRessource } from 'src/models/savedRessource.model';
import { User } from 'src/models/user.model';
import { UserReport } from 'src/models/userReport.model';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

//TODO: à voir
dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.MARIADB_HOST,
  port: Number(process.env.MARIADB_PORT),
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  entities: [User, Category, Comment, Event, Ressource, SavedRessource, ConsultedRessource, UserReport, EventParticipation],
  migrations: ['src/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});