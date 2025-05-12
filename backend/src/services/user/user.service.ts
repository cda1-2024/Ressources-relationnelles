import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { ListUserResponseDto } from 'src/dto/user/reponse/list-user-response.dto';
import { FullUserResponseDto } from 'src/dto/user/reponse/full-user-response.dto';

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

  async findUsersWithFilters(
    pageNumber: number,
    pageSize: number,
    filters?: any,
  ): Promise<ListUserResponseDto> {
    const queryBuilder = await this.usersRepository.createQueryBuilder('user');

    if (filters?.username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${filters.username}%`,
      });
    }

    if (filters?.disbaled) {
      queryBuilder.andWhere('user.disbaled = :disbaled', {
        status: filters.disbaled,
      });
    }

    if (filters?.banned) {
      queryBuilder.andWhere('user.banned = :banned', {
        status: filters.banned,
      });
    }

    const validPageNumber = Number(pageNumber) || 1;
    const validPageSize = Number(pageSize) || 10;

    const [users, total] = await queryBuilder
      .skip((validPageNumber - 1) * validPageSize)
      .take(validPageSize)
      .getManyAndCount();

    if (users.length === 0) {
      throw new NotFoundException('Aucun utilisateur trouvé');
    }

    return UserMapper.toResponseListDto(
      users,
      validPageNumber,
      validPageSize,
      total,
    );
  }

  async findUserById(id: string): Promise<FullUserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }
    return UserMapper.toResponseFullDto(user);
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async countUsers(): Promise<number> {
    return this.usersRepository.count();
  }
}
