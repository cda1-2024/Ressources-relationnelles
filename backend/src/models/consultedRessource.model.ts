import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Ressource } from './ressource.model';


@Entity('Consulted_Ressources')
export class ConsultedRessource {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  ressourceId: number

  @Column({ type: 'datetime' })
  dateTimeConsult: Date;

  @Column({ default: false })
  like: boolean;

  @ManyToOne(() => Ressource, (ressource) => ressource.consultedRessources, 
  { nullable: true })
  ressource: Ressource;

  @ManyToOne(() => User, (user) => user.consultedRessources, 
  { nullable: true })
  user: User;
}
