import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/models/category.model';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  private readonly categoriesRepository: Repository<Category>;

  constructor(@InjectRepository(Category) categoriesRepository: Repository<Category>) {
    this.categoriesRepository = categoriesRepository;
  }

  async findCategoryAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findCategoryById(id: string): Promise<Category | null> {
    const category = await this.categoriesRepository.findOneBy({ id: id });
    return this.categoriesRepository.findOneBy({ id: id });
  }
}
