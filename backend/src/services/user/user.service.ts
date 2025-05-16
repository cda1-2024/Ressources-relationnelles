import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './../../dto/user/request/update-user.dto';
import { IntToUserRole } from 'src/helper/enumMapper';
import { updateMyAccountDto } from 'src/dto/user/request/update-my-account.dto';
import { FilterUserRequestDto } from 'src/dto/user/request/filter-user.dto';
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

  async findUsersWithFilters(filters: FilterUserRequestDto): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (filters?.username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${filters.username}%`,
      });
    }

    if (filters?.disabled !== undefined) {
      queryBuilder.andWhere('user.disabled = :disabled', {
        disabled: filters.disabled,
      });
    }
    if (filters?.banned !== undefined) {
      queryBuilder.andWhere('user.banned = :banned', {
        banned: filters.banned,
      });
    }

    const total = await queryBuilder.getCount();

    const users = await queryBuilder
      .skip((filters.page - 1) * filters.pageSize)
      .take(filters?.pageSize)
      .getMany();

    return { users, total };
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

  async findObjectUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }
    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }
    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async countUsers(): Promise<number> {
    return this.usersRepository.count();
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
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
    const user = await this.usersRepository.findOneByOrFail({ id: id });
    return user;
  }

  async updateMyAccount(idUser: string, updateMyAccountDto: updateMyAccountDto): Promise<User> {
    if (!updateMyAccountDto || Object.values(updateMyAccountDto).every((value) => value === undefined)) {
      throw new BadRequestException('Aucune donnée à mettre à jour');
    }

    const userToUpdate = await this.usersRepository.findOneBy({ id: idUser });
    if (userToUpdate == null) {
      throw new NotFoundException("L'utilisateur n'a pas été trouvé");
    }
    Object.assign(userToUpdate, updateMyAccountDto);

    await this.usersRepository.save(userToUpdate);
    const userResponse = await this.usersRepository.findOneByOrFail({ id: idUser });
    return userResponse;
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
