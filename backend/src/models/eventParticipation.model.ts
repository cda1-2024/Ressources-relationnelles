import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Event } from './event.model';

@Entity()
export class EventParticipation {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  eventId: string;

  @Column({ type: 'datetime' })
  dateTimeParticipation: Date;

  @Column({ default: false })
  win: boolean;

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => Event, (event) => event.eventParticipations, { nullable: true })
  event: Event;

  @ManyToOne(() => User, (user) => user.eventParticipations, { nullable: true })
  user: User;
}
