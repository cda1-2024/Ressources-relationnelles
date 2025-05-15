import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.model';
import { EventParticipation } from './eventParticipation.model';

export enum EventType {
  MORPION = "morpion",
  MOTUS = "motus",
  SONDAGE = "sondage"
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ default: false })
  isRestricted: boolean;

  @Column({ default: false })
  suspended: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({
    type: "enum",
    enum: EventType
  })
  eventType: EventType

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.createdEvents)
  manager: User;

  @OneToMany(() => EventParticipation, (eventParticipation) => eventParticipation.event, 
  { nullable: true })
  eventParticipations: EventParticipation[]
}
