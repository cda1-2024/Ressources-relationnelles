import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../models/user.model';
import { UserRoleToInt } from '../../helper/enum-mapper';

import { BusinessException } from '../../helper/exceptions/business.exception';


interface CreateUserRequestDto {
  email: string;
  username: string;
  password: string;
  role: number;
  bio: string;
}

const USER_NOT_FOUND = "La recherche de l'utilisateur a échoué";

describe('UserService', () => {
  let service: UserService;
  let mockRepository: Partial<Repository<User>>;

  const createMockUser = (overrides: Partial<User> = {}): User => {
    // Create a new User instance
    const user = new User();
    // Define mock data with all required properties
    const mockData = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      bio: '',
      banned: false,
      disabled: false,
      uuidGoogle: null,
      city: '',
      region: '',
      country: '',
      postalCode: '',
      address: null,
      role: UserRole.USER,
      comments: [],
      categories: [],
      events: [],
      resources: [],
      savedResources: [],
      consultedResources: [],
      eventParticipations: [],
      reports: [],
      reportCount: 0,
      hashPassword: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };

    // Apply mock data to the user instance
    return Object.assign(user, mockData);
  };

  beforeEach(() => {
    const mockRepo: Partial<Record<keyof Repository<User>, jest.Mock>> = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findOneByOrFail: jest.fn(),
      create: jest.fn((entity) => entity as User),
      save: jest.fn((entity) => Promise.resolve(entity as User)),
      delete: jest.fn(),
      count: jest.fn(),
    };

    mockRepository = mockRepo as unknown as Repository<User>;
    service = new UserService(mockRepository as Repository<User>);
  });

  describe('findUserAll', () => {
    it('should return all users', async () => {
      const mockUser = createMockUser({
        id: '1',
        username: 'john',
        email: 'john@example.com',
      });

      (mockRepository.find as jest.Mock).mockResolvedValue([mockUser]);
      const result = await service.findUserAll();
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        expect.objectContaining({
          id: '1',
          username: 'john',
          email: 'john@example.com',
        }),
      ]);
    });
  });

  describe('findUserById', () => {
    it('should return user if found', async () => {
      const mockUser = { id: '1', username: 'john' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findUserById('1');
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: {
          createdRessources: true,
          createdEvents: true,
          reportedUsers: true,
        },
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw BusinessException if not found', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
      const promise = service.findUserById('1');
      await expect(promise).rejects.toBeInstanceOf(BusinessException);
      await expect(promise).rejects.toHaveProperty('cause');
      await expect(promise).rejects.toHaveProperty('message', USER_NOT_FOUND);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto: CreateUserRequestDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        role: UserRoleToInt[UserRole.USER],
        bio: 'Test bio',
      };

      const mockUser = createMockUser({
        ...dto,
        id: '1',
        role: UserRole.USER,
      });
      (mockRepository.save as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.createUser(dto);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
        bio: 'Test bio',
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return the updated user', async () => {
      const mockUser = {
        id: '1',
        disabled: false,
        username: 'old',
        email: 'old@example.com',
        bio: 'bio',
        password: 'pass',
        refreshToken: 'token',
      };
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (mockRepository.save as jest.Mock).mockImplementation((user) => Promise.resolve(user));

      const result: User = await service.deleteUser('1');
      expect(result).toMatchObject({
        id: '1',
        disabled: true,
        username: expect.stringContaining('Utilisateur supprimé') as string,
        email: expect.stringContaining('email.supprime') as string,
        bio: '',
        password: '',
        refreshToken: '',
      });
    });

    it('should throw BusinessException if user not found', async () => {
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const promise = service.deleteUser('1');
      await expect(promise).rejects.toBeInstanceOf(BusinessException);
      await expect(promise).rejects.toHaveProperty('cause');
    });
  });
});
