import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, OneToMany } from 'typeorm';
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
  SUPERADMIN = "superAdmin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
  VISITOR = "visitor",
}

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100, nullable: true })
  uuid: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 60 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  banned: boolean;

  @Column({ default: false })
  disabled: boolean;

  @Column({ default: "", length: 100 })
  city: string;

  @Column({ default: "", length: 100 })
  region: string;

  @Column({ default: "", length: 100 })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Comment, (comment) => comment.autor, 
    { nullable: true })
      comments: Comment[]
  
  @OneToMany(() => Category, (category) => category.lastAutor,
    { nullable: true })
    modifiedCategories: Category[]

  @OneToMany(() => Event, (event) => event.manager,
  { nullable: true })
  createdEvents: Event[]

  @OneToMany(() => Ressource, (ressource) => ressource.creator,
  { nullable: true })
  createdRessources: Ressource[]

  @OneToMany(() => Ressource, (ressource) => ressource.validator,
  { nullable: true })
  validatedRessources: Ressource[]

  @OneToMany(() => SavedRessource, (savedRessources) => savedRessources.user, 
  { nullable: true })
  savedRessources: SavedRessource[]

  @OneToMany(() => ConsultedRessource, (consultedRessources) => consultedRessources.user, 
  { nullable: true })
  consultedRessources: ConsultedRessource[]

  @OneToMany(() => EventParticipation, (eventParticipation) => eventParticipation.user, 
  { nullable: true })
  eventParticipations: EventParticipation[]

  @OneToMany(() => UserReport, (userReport) => userReport.reportedUser, 
  { nullable: true })
  reporters: UserReport[]

  @OneToMany(() => UserReport, (userReport) => userReport.reporter, 
  { nullable: true })
  reportedUsers: UserReport[]
}
