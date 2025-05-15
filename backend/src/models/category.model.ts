import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Ressource } from './ressource.model';
import { User } from './user.model';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => Ressource, (ressource) => ressource.category,
  { nullable: true })
  ressources: Ressource[]

  @ManyToOne(() => User, (user) => user.modifiedCategories)
  lastAutor: User;
}
