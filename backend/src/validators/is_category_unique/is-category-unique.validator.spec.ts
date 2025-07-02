import { IsCategoryUniqueConstraint } from './is-category-unique.validator';
import { CategoryService } from 'src/services/category/category.service';
import { ValidationArguments } from 'class-validator';
import { BusinessException } from 'src/helper/exceptions/business.exception';

describe('IsCategoryUniqueConstraint', () => {
  let isUnique: IsCategoryUniqueConstraint;
  let mockService: Partial<CategoryService>;

  beforeEach(() => {
    mockService = {
      findCategoryByName: jest.fn(),
    };
    isUnique = new IsCategoryUniqueConstraint(mockService as CategoryService);
  });

  describe('validate', () => {
    it('should return true if the category name does not exist', async () => {
      (mockService.findCategoryByName as jest.Mock).mockRejectedValue(
        new BusinessException('Category not found', 404, {}),
      );
      const result = await isUnique.validate('UniqueCategory');
      expect(mockService.findCategoryByName).toHaveBeenCalledWith('UniqueCategory');
      expect(result).toBe(true);
    });

    it('should return false if the category name already exists', async () => {
      const existingCategory = { id: 1, name: 'ExistingCategory' };
      (mockService.findCategoryByName as jest.Mock).mockResolvedValue(existingCategory);
      const result = await isUnique.validate('ExistingCategory');
      expect(mockService.findCategoryByName).toHaveBeenCalledWith('ExistingCategory');
      expect(result).toBe(false);
    });

    it('should rethrow error if it is not a NotFoundException', async () => {
      const error = new Error('Database error');
      (mockService.findCategoryByName as jest.Mock).mockRejectedValue(error);

      await expect(isUnique.validate('ErrorCategory')).rejects.toThrow(error);
      expect(mockService.findCategoryByName).toHaveBeenCalledWith('ErrorCategory');
    });

    it('should include the category name in the default error message', () => {
      const args: ValidationArguments = {
        value: 'TestCategory',
        targetName: '',
        object: {},
        property: 'name',
        constraints: [],
      };
      const message = isUnique.defaultMessage(args);
      expect(message).toBe('Le nom de la catégorie "TestCategory" est déjà utilisé.');
    });
  });
});
