import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Comment } from './comment.model';
import { Category } from './category.model';
import { Event } from './event.model';
import { Ressource } from './ressource.model';
import { SavedRessource } from './savedRessource.model';
import { ConsultedRessource } from './consultedRessource.model';
import { EventParticipation } from './eventParticipation.model';
import { UserReport } from './userReport.model';

export enum UserRole {
  SUPERADMIN = 'Super Administrateur',
  ADMIN = 'Administrateur',
  MODERATOR = 'Modérateur',
  USER = 'Utilisateur',
  VISITOR = 'Visiteur',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100, nullable: true })
  uuidGoogle: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 60 })
  username: string;

  @Column({ default: '', length: 1000 })
  bio: string;

  @Column({ select: false, length: 100 })
  password: string;

  @Column({ default: false })
  banned: boolean;

  @Column({ default: false })
  disabled: boolean;

  @Column({ default: '', length: 100 })
  city: string;

  @Column({ default: '', length: 100 })
  region: string;

  @Column({ default: '', length: 100 })
  country: string;

  @Column({ default: '', length: 100 })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(this.password, salt);
    this.password = password;
  }

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Category, (category) => category.lastAuthor, {
    nullable: true,
  })
  modifiedCategories: Category[];

  @OneToMany(() => Event, (event) => event.manager, { nullable: true })
  createdEvents: Event[];

  @OneToMany(() => Ressource, (ressource) => ressource.creator, {
    nullable: true,
  })
  createdRessources: Ressource[];

  @OneToMany(() => Ressource, (ressource) => ressource.validator, {
    nullable: true,
  })
  validatedRessources: Ressource[];

  @OneToMany(() => SavedRessource, (savedRessources) => savedRessources.user, {
    nullable: true,
  })
  savedRessources: SavedRessource[];

  @OneToMany(() => ConsultedRessource, (consultedRessources) => consultedRessources.user, { nullable: true })
  consultedRessources: ConsultedRessource[];

  @OneToMany(() => EventParticipation, (eventParticipation) => eventParticipation.user, { nullable: true })
  eventParticipations: EventParticipation[];

  @OneToMany(() => UserReport, (userReport) => userReport.reportedUser, {
    nullable: true,
  })
  reporters: UserReport[];

  @OneToMany(() => UserReport, (userReport) => userReport.reporter, {
    nullable: true,
  })
  reportedUsers: UserReport[];
}
