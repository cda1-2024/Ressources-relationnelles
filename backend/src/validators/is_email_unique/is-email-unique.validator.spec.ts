import { IsEmailUniqueConstraint } from './is-email-unique.validator';
import { UserService } from 'src/services/user/user.service';
import { ValidationArguments } from 'class-validator';

describe('IsEmailUniqueConstraint', () => {
  let isUnique: IsEmailUniqueConstraint;
  let mockService: Partial<UserService>;

  beforeEach(() => {
    mockService = {
      findUserByIdentifier: jest.fn(),
    };
    isUnique = new IsEmailUniqueConstraint(mockService as UserService);
  });

  describe('validate', () => {
    it('should return true if the email does not exist', async () => {
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue(null);
      const result = await isUnique.validate('unique@gmail.com');
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('unique@gmail.com');
      expect(result).toBe(true);
    });

    it('should return false if the email already exists', async () => {
      const existingUser = {
        id: 1,
        email: 'used@gmail.com',
        name: 'Existing User',
      };
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue(existingUser);
      const result = await isUnique.validate('used@gmail.com');
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('used@gmail.com');
      expect(result).toBe(false);
    });

    it('should handle errors from the user service', async () => {
      const error = new Error('Database error');
      (mockService.findUserByIdentifier as jest.Mock).mockRejectedValue(error);

      await expect(isUnique.validate('error@example.com')).rejects.toThrow(error);
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('error@example.com');
    });

    it('should include the email in the default error message', () => {
      const args: ValidationArguments = {
        value: 'test@example.com',
        targetName: '',
        object: {},
        property: 'email',
        constraints: [],
      };
      const message = isUnique.defaultMessage(args);
      expect(message).toBe('L\'email "test@example.com" est déjà utilisé.');
    });
  });
});
