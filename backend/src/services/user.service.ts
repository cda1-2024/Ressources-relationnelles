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
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findUserByIdentifier(identifier: string): Promise<User | null> {
    return this.usersRepository.findOneBy({email: identifier});
  }
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id });
  }
}
