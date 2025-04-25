import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Search_Stats')
export class SearchedStats {
  @PrimaryColumn()
    search: string;

  @PrimaryColumn()
    userId: number;

  @Column({ type: 'datetime' })
    dateTimeSearch: Date;
}