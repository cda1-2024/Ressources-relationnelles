import { IsUsernameUniqueConstraint } from './is-username-unique.validator';
import { UserService } from 'src/services/user/user.service';
import { ValidationArguments } from 'class-validator';

describe('IsUsernameUniqueConstraint', () => {
  let validator: IsUsernameUniqueConstraint;
  let mockService: Partial<UserService>;

  beforeEach(() => {
    mockService = {
      findUserByIdentifier: jest.fn(),
    };
    validator = new IsUsernameUniqueConstraint(mockService as UserService);
  });

  describe('validate', () => {
    it('should return true if the username does not exist', async () => {
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue(null);
      const result = await validator.validate('newuser');
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('newuser');
      expect(result).toBe(true);
    });

    it('should return false if the username already exists', async () => {
      const existingUser = {
        id: 1,
        username: 'existinguser',
        email: 'user@example.com',
      };
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue(existingUser);
      const result = await validator.validate('existinguser');
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('existinguser');
      expect(result).toBe(false);
    });

    it('should handle errors from the user service', async () => {
      const error = new Error('Database error');
      (mockService.findUserByIdentifier as jest.Mock).mockRejectedValue(error);

      await expect(validator.validate('erroruser')).rejects.toThrow(error);
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('erroruser');
    });

    it('should include the username in the default error message', () => {
      const args: ValidationArguments = {
        value: 'takenusername',
        targetName: '',
        object: {},
        property: 'username',
        constraints: [],
      };
      const message = validator.defaultMessage(args);
      expect(message).toBe('Le nom d\'utilisateur "takenusername" est déjà pris.');
    });
  });
});
