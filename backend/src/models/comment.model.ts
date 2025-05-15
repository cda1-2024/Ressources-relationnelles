import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Ressource } from './ressource.model';
import { User } from './user.model';
import { UserReport } from './userReport.model';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'longtext' })
  message: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Ressource, (ressource) => ressource.comments)
  ressource: Ressource;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Comment, (comment) => comment.childComments,
  { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment, 
  { nullable: true })
  childComments: Comment[]

  @OneToMany(() => UserReport, (userReport) => userReport.reportedComment, 
  { nullable: true })
  userReports: UserReport[]
}
