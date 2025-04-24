import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.model';
import { Comment } from './comment.model';
import { User } from './user.model';
import { SavedRessource } from './savedRessource.model';
import { ConsultedRessource } from './consultedRessource.model';

export enum RessourceType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
}

export enum Visibility {
  RESTRICTED = 'restricted',
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum State {
  DRAFT = 'draft',
  TOVALIDATE = 'toValidate',
  PUBLISHED = 'published',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

@Entity('Ressources')
export class Ressource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'longtext' })
  contentText: string;

  @Column({ length: 100, nullable: true })
  contentLink: string;

  @Column({ default: false })
  adminValidation: boolean;

  @Column({ type: 'datetime', nullable: true })
  dateTimeValidation: Date;

  @Column({
    type: 'enum',
    enum: RessourceType,
    default: RessourceType.TEXT,
  })
  ressourceType: RessourceType;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PRIVATE,
  })
  visibility: Visibility;

  @Column({
    type: 'enum',
    enum: State,
    default: State.DRAFT,
  })
  state: State;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.ressources, {
    nullable: true,
  })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.ressource, { nullable: true })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.createdRessources)
  creator: User;

  @ManyToOne(() => User, (user) => user.validatedRessources)
  validator: User;

  @OneToMany(
    () => SavedRessource,
    (savedRessources) => savedRessources.ressource,
    { nullable: true },
  )
  savedRessources: SavedRessource[];

  @OneToMany(
    () => ConsultedRessource,
    (consultedRessources) => consultedRessources.ressource,
    { nullable: true },
  )
  consultedRessources: ConsultedRessource[];
}
