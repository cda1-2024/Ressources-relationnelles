import {
  BadRequestException,
  forwardRef,
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
import { CreateCategoryDto } from 'src/dto/category/request/create-category.dto';

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

  async findCategoryById(id: string): Promise<Category> {
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
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    if (
      createCategoryDto.name == undefined ||
      createCategoryDto.color == undefined ||
      createCategoryDto.icon == undefined
    ) {
      throw new BadRequestException('Les champs name, icon et color sont requis');
    }

    const category = new Category();
    category.name = createCategoryDto.name;
    category.color = createCategoryDto.color;
    category.iconPath = createCategoryDto.icon;
    category.lastAuthor = user;
    const newCategory = await this.categoriesRepository.save(category);
    console.log('Nouvelle catégorie créée:', newCategory);
    console.log(newCategory);
    return newCategory;
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
  }

  async deleteCategory(id: string, user: User): Promise<boolean> {
    const category = await this.findCategoryById(id);
    if (!category) {
      throw new NotFoundException("La catégorie n'a pas été trouvée");
    }
    await this.ressourceService.deleteCategory(id);
    await this.categoriesRepository.delete(category.id);
    return true;
  }
}
