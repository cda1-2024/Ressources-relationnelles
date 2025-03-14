import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { EventType } from './eventType.model';

@Entity('Events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => EventType, (eventType) => eventType.events)
  eventType: EventType;
}
