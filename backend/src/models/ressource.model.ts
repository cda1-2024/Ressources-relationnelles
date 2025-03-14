import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { RessourceType } from './ressourceType.model';
import { Category } from './category.model';

@Entity('Ressources')
export class Ressource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ default: false })
  adminValidation: boolean;

  @Column({ type: 'datetime' })
  dateTimeValidation: Date;

  @Column({ default: false })
  isRestricted: boolean;

  @Column({ default: false })
  suspended: boolean;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => RessourceType, (ressourceType) => ressourceType.ressources)
  ressourceType: RessourceType;

  @ManyToOne(() => Category, (category) => category.ressources)
  category: Category;
}
