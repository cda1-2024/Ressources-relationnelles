import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly usersRepository: Repository<User>;

  constructor(@InjectRepository(User) usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async findUserAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
      where: [{ email: identifier }, { username: identifier }],
    });
  }
  async findUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
      where: [{ username: username }],
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
      where: [{ email: email }],
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}
