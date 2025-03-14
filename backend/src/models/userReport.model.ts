import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Event } from './event.model';

export enum ReportReason {
  SUPERADMIN = "superAdmin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
  VISITOR = "visitor",
}

@Entity('User_Report')
export class UserReport {
  @PrimaryColumn()
  reporterId: number

  @PrimaryColumn()
  reportedUserId: number

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'longtext' })
  moderatorView: string;

  @Column({ default: false })
  isResolved: boolean;

  @Column({
    type: "enum",
    enum: ReportReason,
    default: ReportReason.USER,
  })
  ressourceType: ReportReason

  @ManyToOne(() => Event, (event) => event.eventParticipations, 
  { nullable: true })
  event: Event;

  @ManyToOne(() => User, (user) => user.eventParticipations, 
  { nullable: true })
  user: User;
}
