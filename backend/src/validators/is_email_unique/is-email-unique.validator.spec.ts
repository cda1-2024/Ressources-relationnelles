import { IsEmailUniqueConstraint } from './is-email-unique.validator';
import { UserService } from 'src/services/user/user.service';

describe('IsCategoryUniqueConstraint', () => {
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
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue({ id: 1, email: 'used@gmail.com' });
      const result = await isUnique.validate('used@gmail.com');
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('used@gmail.com');
      expect(result).toBe(false);
    });
  });
  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const value:string = 'test@gmail.com'
      const message = isUnique.defaultMessage({
        value,
        constraints: [],
        targetName: '',
        object: {},
        property: '',
      });
      expect(message).toBe(`L'email "${value}" est déjà utilisé.`);
    });
  });
});
