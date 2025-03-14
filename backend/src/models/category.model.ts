import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Ressource } from './ressource.model';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  iconPath: string;

  @Column({ length: 20 })
  color: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ressource, (ressource) => ressource.category)
    ressources: Ressource[]
}
