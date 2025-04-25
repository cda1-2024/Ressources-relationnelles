import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Search_Stats')
export class SearchedStats {
  @PrimaryColumn()
    search: string;

  @PrimaryColumn('uuid')
    userId: string;

  @Column({ type: 'datetime' })
    dateTimeSearch: Date;
}