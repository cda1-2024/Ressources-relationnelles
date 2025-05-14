import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { ListUserResponseDto, UserResponseDto } from 'src/dto/user/response/list-user-response.dto';
import { FullUserResponseDto } from 'src/dto/user/response/full-user-response.dto';
import { UpdateUserDto } from './../../dto/user/request/update-user.dto';
import { IntToUserRole } from 'src/helper/enumMapper';
import { updateMyAccount } from './../../dto/user/request/update-my-account';

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

  async findUsersWithFilters(pageNumber: number, pageSize: number, filters?: any): Promise<ListUserResponseDto> {
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

    return UserMapper.toResponseListDto(users, validPageNumber, validPageSize, total);
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

  async updateUser(id: string, userDto: UpdateUserDto): Promise<UserResponseDto> {
    if (!userDto || Object.values(userDto).every((value) => value === undefined)) {
      throw new BadRequestException('Aucune donnée à mettre à jour');
    }

    const userToUpdate = await this.usersRepository.findOneBy({ id: id });
    if (userToUpdate == null) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }
    Object.assign(userToUpdate, userDto);
    if (userDto.role) {
      userToUpdate.role = IntToUserRole[userDto.role];
    }

    await this.usersRepository.save(userToUpdate);
    const user = await this.usersRepository.findOneByOrFail({ id: id })!;
    return UserMapper.toResponseDto(user);
  }

  async updateMyAccount(idUser: string, updateMyAccount: updateMyAccount): Promise<UserResponseDto> {
    if (!updateMyAccount || Object.values(updateMyAccount).every((value) => value === undefined)) {
      throw new BadRequestException('Aucune donnée à mettre à jour');
    }

    const userToUpdate = await this.usersRepository.findOneBy({ id: idUser });
    if (userToUpdate == null) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }
    Object.assign(userToUpdate, updateMyAccount);

    await this.usersRepository.save(userToUpdate);
    const userResponse = await this.usersRepository.findOneByOrFail({ id: idUser })!;
    return UserMapper.toResponseDto(userResponse);
  }

  async deleteUser(id: string): Promise<boolean> {
    const userToDelete = await this.usersRepository.findOneBy({ id: id });
    if (!userToDelete) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }

    if (await this.usersRepository.delete(userToDelete.id)) {
      return true;
    }
    return false;
  }
}
