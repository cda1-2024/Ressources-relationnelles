import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category.model';
import { Comment } from './comment.model';
import { User } from './user.model';
import { SavedRessource } from './savedRessource.model';
import { ConsultedRessource } from './consultedRessource.model';


export enum RessourceType {
  SUPERADMIN = "superAdmin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
  VISITOR = "visitor",
}

@Entity('Ressources')
export class Ressource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'longtext' })
  contentText: string;

  @Column({ length: 100 })
  contentLink: string;

  @Column({ default: false })
  adminValidation: boolean;

  @Column({ type: 'datetime' })
  dateTimeValidation: Date;

  @Column({ default: false })
  isRestricted: boolean;

  @Column({ default: false })
  suspended: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({
    type: "enum",
    enum: RessourceType,
    default: RessourceType.USER,
  })
  ressourceType: RessourceType

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.ressources, 
  { nullable: true })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.ressource, 
  { nullable: true })
  comments: Comment[]

  @ManyToOne(() => User, (user) => user.createdRessources)
  creator: User;

  @ManyToOne(() => User, (user) => user.validatedRessources)
  validator: User;

  @OneToMany(() => SavedRessource, (savedRessources) => savedRessources.ressource, 
  { nullable: true })
  savedRessources: SavedRessource[]

  @OneToMany(() => ConsultedRessource, (consultedRessources) => consultedRessources.ressource, 
  { nullable: true })
  consultedRessources: ConsultedRessource[]
}
