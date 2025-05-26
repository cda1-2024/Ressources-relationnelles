import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './../../dto/user/request/update-user.dto';
import { IntToUserRole } from 'src/helper/enum-mapper';
import { updateMyAccountDto } from 'src/dto/user/request/update-my-account.dto';
import { FilterUserRequestDto } from 'src/dto/user/request/filter-user.dto';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
@Injectable()
export class UserService {
  private readonly usersRepository: Repository<User>;

  constructor(@InjectRepository(User) usersRepository: Repository<User>) {
    this.usersRepository = createLoggedRepository(usersRepository);
  }

  async findUserAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw new BusinessException('La recherche des utilisateurs a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    try {
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
    } catch (error) {
      throw new BusinessException("La recherche de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    try {
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
    } catch (error) {
      throw new BusinessException("La recherche de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findUsersWithFilters(filters: FilterUserRequestDto): Promise<{ users: User[]; total: number }> {
    try {
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
    } catch (error) {
      throw new BusinessException('La recherche des utilisateurs a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
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
    } catch (error) {
      throw new BusinessException("La recherche de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });

      if (!user) {
        throw new NotFoundException("L'utilisateur n'a pas été trouvé");
      }
      return user;
    } catch (error) {
      throw new BusinessException("La recherche de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async createUser(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.usersRepository.create(user);
      console.log(newUser);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BusinessException("La création de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async countUsers(): Promise<number> {
    try {
      return this.usersRepository.count();
    } catch (error) {
      throw new BusinessException('Le compte des utilisateurs a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    try {
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
    } catch (error) {
      throw new BusinessException("La mise à jour de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async updateMyAccount(idUser: string, updateMyAccountDto: updateMyAccountDto): Promise<User> {
    try {
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
    } catch (error) {
      throw new BusinessException("La mise à jour de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const userToDelete = await this.usersRepository.findOneBy({ id: id });
      if (!userToDelete) {
        throw new NotFoundException("L'utilisateur n'a pas été trouvé");
      }

      if (await this.usersRepository.delete(userToDelete.id)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new BusinessException("La suppression de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }
}
