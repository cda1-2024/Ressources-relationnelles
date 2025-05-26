import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from 'src/dto/category/request/update-category.dto';
import { Category } from 'src/models/category.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { RessourceService } from './../ressource/ressource.service';
import { CreateCategoryDto } from 'src/dto/category/request/create-category.dto';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { BusinessException } from 'src/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';

@Injectable()
export class CategoryService {
  private readonly categoriesRepository: Repository<Category>;

  constructor(
    @InjectRepository(Category) categoriesRepository: Repository<Category>,
    @Inject(forwardRef(() => RessourceService))
    private readonly ressourceService: RessourceService,
  ) {
    this.categoriesRepository = createLoggedRepository(categoriesRepository);
  }

  async getCategoryAll(): Promise<Category[]> {
    try {
      return this.categoriesRepository.find();
    } catch (error) {
      throw new BusinessException('La recherche des catégories a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findCategoryById(id: string): Promise<Category> {
    try {
      const category: Category | null = await this.categoriesRepository.findOne({
        where: { id: id },
        relations: {
          lastAuthor: true,
        },
      });
      if (category == null) {
        throw new NotFoundException("La catégorie n'a pas été trouvée");
      }
      return category;
    } catch (error) {
      throw new BusinessException('La recherche de la catégorie a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    try {
      const category = new Category();
      category.name = createCategoryDto.name;
      category.color = createCategoryDto.color;
      category.iconPath = createCategoryDto.icon;
      category.lastAuthor = user;
      const newCategory = await this.categoriesRepository.save(category);
      return newCategory;
    } catch (error) {
      throw new BusinessException('La création de la catégorie a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async findCategoryByName(name: string): Promise<Category> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { name: name },
      });
      if (category == null) {
        throw new NotFoundException("La catégorie n'a pas été trouvée");
      }
      return category;
    } catch (error) {
      throw new BusinessException('La recherche de la catégorie a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, user: User): Promise<Category | null> {
    try {
      if (!updateCategoryDto || Object.values(updateCategoryDto).every((value) => value === undefined)) {
        throw new BadRequestException('Aucune donnée à mettre à jour.');
      }

      const existingCategory = await this.findCategoryById(id);
      if (!existingCategory) {
        throw new NotFoundException("La catégorie n'a pas été trouvée.");
      }

      Object.assign(existingCategory, updateCategoryDto);
      existingCategory.lastAuthor = user;
      await this.categoriesRepository.save(existingCategory);
      return this.findCategoryById(id);
    } catch (error) {
      throw new BusinessException('La mise à jour de la catégorie a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const category = await this.findCategoryById(id);
      if (!category) {
        throw new NotFoundException("La catégorie n'a pas été trouvée");
      }
      await this.ressourceService.deleteCategory(id);
      await this.categoriesRepository.delete(category.id);
      return true;
    } catch (error) {
      throw new BusinessException('La suppression de la catégorie a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }
}
