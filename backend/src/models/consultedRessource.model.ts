import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Ressource } from './ressource.model';

@Entity('Consulted_Ressources')
export class ConsultedRessource {
  @PrimaryColumn('uuid')
  userId: string

  @PrimaryColumn('uuid')
  ressourceId: string

  @Column({ type: 'datetime' })
  dateTimeConsult: Date;

  @ManyToOne(() => Ressource, (ressource) => ressource.consultedRessources, 
  { nullable: true })
  ressource: Ressource;

  @ManyToOne(() => User, (user) => user.consultedRessources, 
  { nullable: true })
  user: User;
}
