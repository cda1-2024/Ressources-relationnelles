import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Ressource } from './ressource.model';
import { User } from './user.model';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  message: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Ressource, (ressource) => ressource.comments)
  ressource: Ressource;

  @ManyToOne(() => User, (user) => user.comments)
  autor: User;

  @ManyToOne(() => Comment, (comment) => comment.childComments,
  { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment, 
  { nullable: true })
  childComments: Comment[]
}
