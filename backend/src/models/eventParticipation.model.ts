import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Event } from './event.model';


@Entity('Event_Particpations')
export class EventParticipation {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  eventId: number

  @Column({ type: 'datetime' })
  dateTimeParticipation: Date;

  @Column({ default: false })
  win: boolean;

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => Event, (event) => event.eventParticipations, 
  { nullable: true })
  event: Event;

  @ManyToOne(() => User, (user) => user.eventParticipations, 
  { nullable: true })
  user: User;
}
