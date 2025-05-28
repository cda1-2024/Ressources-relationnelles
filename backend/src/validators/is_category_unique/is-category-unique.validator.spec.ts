import { IsCategoryUniqueConstraint } from './is-category-unique.validator';
import { CategoryService } from 'src/services/category/category.service';

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
      (mockService.findCategoryByName as jest.Mock).mockResolvedValue(null);
      const result = await isUnique.validate('UniqueCategory');
      expect(mockService.findCategoryByName).toHaveBeenCalledWith('UniqueCategory');
      expect(result).toBe(true);
    });

    it('should return false if the category name already exists', async () => {
      (mockService.findCategoryByName as jest.Mock).mockResolvedValue({ id: 1, name: 'ExistingCategory' });
      const result = await isUnique.validate('ExistingCategory');
      expect(mockService.findCategoryByName).toHaveBeenCalledWith('ExistingCategory');
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
      expect(message).toBe(`Le nom de la catégorie "${value}" est déjà utilisé.`);
    });
  });
});
