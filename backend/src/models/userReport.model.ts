import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Comment } from './comment.model';

export enum ReportReason {
  SUPERADMIN = 'superAdmin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  VISITOR = 'visitor',
}

@Entity()
export class UserReport {
  @PrimaryColumn('uuid')
  reporterId: string;

  @PrimaryColumn('uuid')
  reportedUserId: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'longtext' })
  moderatorView: string;

  @Column({ default: false })
  isResolved: boolean;

  @Column({
    type: 'enum',
    enum: ReportReason,
    default: ReportReason.USER,
  })
  ressourceType: ReportReason;

  @ManyToOne(() => User, (user) => user.reporters, { nullable: true })
  reportedUser: User;

  @ManyToOne(() => User, (user) => user.reportedUsers)
  reporter: User;

  @ManyToOne(() => Comment, (comment) => comment.userReports, { nullable: true })
  reportedComment: Comment;
}
