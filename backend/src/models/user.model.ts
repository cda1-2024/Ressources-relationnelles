import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  SUPERADMIN = "superAdmin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
  VISITOR = "visitor",
}

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 60 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  banned: boolean;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
