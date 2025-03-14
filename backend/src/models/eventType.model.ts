import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './event.model';

@Entity('Event_types')
export class EventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  designation: string;

  @OneToMany(() => Event, (event) => event.eventType)
  events: Event[]
}
