import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Category } from '../models/category.model';
import { Comment } from '../models/comment.model';
import { ConsultedRessource } from '../models/consultedRessource.model';
import { Event } from '../models/event.model';
import { EventParticipation } from '../models/eventParticipation.model';
import { Ressource } from '../models/ressource.model';
import { SavedRessource } from '../models/savedRessource.model';
import { SearchedStats } from '../models/searchStats.model';
import { User } from '../models/user.model';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserReport } from '../models/userReport.model';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mariadb',
  host: `${process.env.MARIADB_HOST}`,
  port: `${process.env.MARIADB_PORT}`,
  username: `${process.env.MARIADB_USER}`,
  password: `${process.env.MARIADB_PASSWORD}`,
  database: `${process.env.MARIADB_DATABASE}`,
  entities: [
    User,
    Category,
    Comment,
    Ressource,
    Event,
    ConsultedRessource,
    EventParticipation,
    SavedRessource,
    SearchedStats,
    UserReport,
  ],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
  // logging: true,
};

export default registerAs('datasource', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
