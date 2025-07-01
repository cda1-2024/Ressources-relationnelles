import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { UpdateUserDto } from 'src/dto/user/request/update-user.dto';
import { USER_NOT_FOUND } from 'src/helper/constants/constant-exception';
import { CreateUserRequestDto } from 'src/dto/user/request/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: Partial<Repository<User>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findOneByOrFail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
    service = new UserService(mockRepository as Repository<User>);
  });

  describe('validate', () => {
    it('should return all users', async () => {
      (mockRepository.find as jest.Mock).mockResolvedValue([{ id: '1', username: 'john' }]);
      const result = await service.findUserAll();
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1', username: 'john' }]);
    });
  });

  describe('findUserById', () => {
    it('should return user if found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue({ id: '1', username: 'john' });
      const result = await service.findUserById('1');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual({ id: '1', username: 'john' });
    });

    it('should throw NotFoundException if not found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.findUserById('1')).rejects.toThrow(BusinessException);
      await expect(service.findUserById('1')).rejects.toMatchObject({
        cause: expect.any(NotFoundException) as unknown,
      });
      await expect(service.findUserById('1')).rejects.toThrow(USER_NOT_FOUND);
    });
  });

  describe('createUser', () => {
    it('should create and save user', async () => {
      const newUser: CreateUserRequestDto = {
        email: 'john@example.com',
        username: 'john',
        password: 'hashed',
        role: 1,
        bio: '',
      };
      const savedUser = { id: '1', ...newUser };
      (mockRepository.create as jest.Mock).mockReturnValue(newUser);
      (mockRepository.save as jest.Mock).mockResolvedValue(savedUser);

      const result = await service.createUser(newUser);
      expect(mockRepository.create).toHaveBeenCalledWith(newUser);
      expect(mockRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(savedUser);
    });
  });

  describe('updateUser', () => {
    it('should update user correctly with DTO data', async () => {
      const existingUser = { id: '1', username: 'oldName', role: 0 };
      const dto: UpdateUserDto = {
        username: 'oldName',
        role: 0,
        profile_picture: 'null',
        bio: 'fe',
        banned: false,
        disabled: false,
      };

      const updatedUser = { ...existingUser, ...dto };

      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(existingUser);
      (mockRepository.findOneByOrFail as jest.Mock).mockResolvedValue(existingUser);
      (mockRepository.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', dto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw BusinessException if user not found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const result = service.updateUser('1', { username: 'jane' });
      await expect(result).rejects.toThrow(BusinessException);
      await expect(result).rejects.toMatchObject({
        cause: expect.any(NotFoundException) as unknown,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return true', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue({ id: '1' });
      (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.deleteUser('1');
      expect(result).toBe(true);
    });

    it('should throw BusinessException if user not found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteUser('1')).rejects.toThrow(BusinessException);
      await expect(service.deleteUser('1')).rejects.toMatchObject({
        cause: expect.any(NotFoundException) as unknown,
      });
    });
  });
});
