import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Ressource } from './ressource.model';


@Entity('Saved_Ressources')
export class SavedRessource {
  @PrimaryColumn('uuid')
  userId: string

  @PrimaryColumn('uuid')
  ressourceId: string

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ default: false })
  isToLater: boolean;

  @Column({ default: false })
  like: boolean;

  @ManyToOne(() => Ressource, (ressource) => ressource.savedRessources, 
  { nullable: true })
  ressource: Ressource;

  @ManyToOne(() => User, (user) => user.savedRessources, 
  { nullable: true })
  user: User;
}
