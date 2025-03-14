import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Ressource } from './ressource.model';

@Entity('Ressource_types')
export class RessourceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  designation: string;

  @OneToMany(() => Ressource, (ressource) => ressource.ressourceType)
  ressources: Ressource[]
}
