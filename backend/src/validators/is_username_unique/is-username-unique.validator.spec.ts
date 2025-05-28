import { IsUsernameUniqueConstraint } from './is-username-unique.validator';
import { UserService } from 'src/services/user/user.service';

describe('IsCategoryUniqueConstraint', () => {
  let isUnique: IsUsernameUniqueConstraint;
  let mockService: Partial<UserService>;

  beforeEach(() => {
    mockService = {
      findUserByIdentifier: jest.fn(),
    };
    isUnique = new IsUsernameUniqueConstraint(mockService as UserService);
  });

  describe('validate', () => {
    it('should return true if the username does not exist', async () => {
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue(null);
      const result = await isUnique.validate('unique@gmail.com');
      expect(mockService.findUserByIdentifier).toHaveBeenCalledWith('unique@gmail.com');
      expect(result).toBe(true);
    });

    it('should return false if the username already exists', async () => {
      (mockService.findUserByIdentifier as jest.Mock).mockResolvedValue({ id: 1, name: 'used@gmail.com' });
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
      expect(message).toBe(`Le nom d'utilisateur "${value}" est déjà pris.`);
    });
  });
});
