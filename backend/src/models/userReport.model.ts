import { Entity, Column, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.model';
import { Comment } from './comment.model';

export enum ReportReason {
  SPAM = 'Spam',
  HARASSMENT = 'Harcèlement',
  INAPPROPRIATE_CONTENT = 'Contenu inapproprié',
  FAKE_PROFILE = 'Profil factice',
  VIOLATION_OF_TERMS = 'Violation des conditions d’utilisation',
  HATE_SPEECH = 'Discours de haine',
  SCAM = 'Arnaque',
  OTHER = 'Autre',
}

@Entity()
export class UserReport {
  @PrimaryColumn('uuid')
  reporterId: string;

  @PrimaryColumn('uuid')
  reportedUserId: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  moderatorView: string;

  @Column({ default: false })
  isResolved: boolean;

  @Column({
    type: 'enum',
    enum: ReportReason,
    default: ReportReason.OTHER,
  })
  reportReason: ReportReason;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reportedUsers)
  reportedUser: User;

  @ManyToOne(() => User, (user) => user.reporters)
  reporter: User;

  @ManyToOne(() => Comment, (comment) => comment.userReports, { nullable: true })
  reportedComment: Comment;
}
