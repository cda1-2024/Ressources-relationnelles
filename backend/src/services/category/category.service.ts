import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from 'src/dto/category/request/update-category.dto';
import { Category } from 'src/models/category.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { RessourceService } from './../ressource/ressource.service';

@Injectable()
export class CategoryService {
  private readonly categoriesRepository: Repository<Category>;

  constructor(
    @InjectRepository(Category) categoriesRepository: Repository<Category>,
    @Inject(forwardRef(() => RessourceService))
    private readonly ressourceService: RessourceService,
  ) {
    this.categoriesRepository = categoriesRepository;
  }

  async getCategoryAll(): Promise<Category[]> {
    try {
      return this.categoriesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des catégories: ' + error.message);
    }
  }

  async findCategoryById(id: string): Promise<Category | null> {
    try {
      return this.categoriesRepository.findOne({
        where: { id: id },
        relations: {
          lastAutor: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération de la catégorie: ' + error.message);
    }
  }

  async createCategory(category: Category): Promise<Category> {
    try {
      const newCategory = this.categoriesRepository.create(category);
      return this.categoriesRepository.save(newCategory);
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la création de la catégorie: ' + error.message);
    }
  }

  async findCategoryByName(name: string): Promise<Category | null> {
    try {
      return this.categoriesRepository.findOne({
        where: { name: name },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération de la catégorie: ' + error.message);
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
      existingCategory.lastAutor = user;
      const updatedCategory = await this.categoriesRepository.save(existingCategory);
      return this.findCategoryById(id);
    } catch (error) {
      throw error('Erreur lors de la mise à jour de la catégorie: ' + error.message);
    }
  }
  async findCategoryDeletedById(id: string): Promise<boolean> {
    const category = await this.categoriesRepository.findOneBy({ id: id });
    return category != null;
  }

  async deleteCategory(id: string, user: User): Promise<boolean> {
    try {
      const category = await this.findCategoryById(id);
      if (!category) {
        throw new NotFoundException("La catégorie n'a pas été trouvée.");
      }
      category.deleted = true;
      category.lastAutor = user;
      await this.categoriesRepository.save(category);
      await this.ressourceService.deleteCategory(id);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la suppression de la catégorie: ' + error.message);
    }
  }
}
