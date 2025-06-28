import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './../../dto/user/request/update-user.dto';
import { UserRoleFromInt } from 'src/helper/enum-mapper';
import { updateMyAccountDto } from 'src/dto/user/request/update-my-account.dto';
import { FilterUserRequestDto } from 'src/dto/user/request/filter-user.dto';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { USER_NOT_FOUND } from 'src/helper/constants/constant-exception';
import * as bcrypt from 'bcrypt';
import { updateMyPasswordDto } from 'src/dto/user/request/update-my-password.dto';

@Injectable()
export class UserService {
  private readonly usersRepository: Repository<User>;

  constructor(@InjectRepository(User) usersRepository: Repository<User>) {
    this.usersRepository = createLoggedRepository(usersRepository);
  }

  async findUserAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new BusinessException('La recherche des utilisateurs a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
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

  async findUsersWithFilters(filters: FilterUserRequestDto): Promise<{ users: User[]; total: number }> {
    try {
      const queryBuilder = this.usersRepository
        .createQueryBuilder('user')
        .loadRelationCountAndMap('user.ressourcesCount', 'user.createdRessources')
        .loadRelationCountAndMap('user.eventsCount', 'user.createdEvents');

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

      if (filters?.role) {
        queryBuilder.andWhere('user.role = :role', {
          role: UserRoleFromInt[filters.role],
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

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });

      if (!user) {
        throw new NotFoundException("L'utilisateur n'a pas été trouvé");
      }
      return user;
    } catch (error) {
      throw new BusinessException(USER_NOT_FOUND, getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async createUser(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BusinessException("La création de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async countUsers(): Promise<number> {
    try {
      return await this.usersRepository.count();
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
        userToUpdate.role = UserRoleFromInt[userDto.role];
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

  async updateMyPassword(idUser: string, updateMyPasswordDto: updateMyPasswordDto): Promise<User> {
    try {
      if (!updateMyPasswordDto || Object.values(updateMyPasswordDto).every((value) => value === undefined)) {
        throw new BadRequestException('Aucune donnée à mettre à jour');
      }

      const userToUpdate = await this.usersRepository.findOne({
        select: {
          id: true,
          password: true,
        },
        where: [{ id: idUser }],
      });
      if (!userToUpdate) {
        throw new NotFoundException("L'utilisateur n'a pas été trouvé");
      }
      await bcrypt.compare(updateMyPasswordDto.oldPassword, userToUpdate.password).then((isMatch) => {
        if (!isMatch) {
          throw new BadRequestException('Le mot de passe est incorrect');
        }
      });
      userToUpdate.password = await bcrypt.hash(updateMyPasswordDto.newPassword, 10);

      await this.usersRepository.save(userToUpdate);
      const userResponse = await this.usersRepository.findOneByOrFail({ id: idUser });
      return userResponse;
    } catch (error) {
      throw new BusinessException('La mise à jour du mot de passe a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const userToDelete = await this.usersRepository.findOneBy({ id: id });
      if (!userToDelete) {
        throw new NotFoundException("L'utilisateur n'a pas été trouvé");
      }
      if (userToDelete.disabled) {
        throw new BadRequestException("L'utilisateur est déjà désactivé");
      }

      userToDelete.disabled = true;
      userToDelete.bio = '';
      userToDelete.username = 'Utilisateur supprimé ' + userToDelete.id;
      userToDelete.email = 'email.supprime.' + userToDelete.id + '@example.com';
      userToDelete.password = '';
      userToDelete.refreshToken = '';
      await this.usersRepository.save(userToDelete);
      return userToDelete;
    } catch (error) {
      throw new BusinessException("La suppression de l'utilisateur a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async updateRefreshToken(userId: string, newRefreshToken: string): Promise<void> {
    try {
      const refreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.usersRepository.update(userId, { refreshToken });
    } catch (error) {
      throw new BusinessException('La mise à jour du refresh token a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    try {
      await this.usersRepository.update(userId, { refreshToken: '' });
    } catch (error) {
      throw new BusinessException('La suppression du refresh token a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }
}
