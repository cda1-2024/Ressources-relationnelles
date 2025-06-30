import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from 'src/services/category/category.service';
import { Category } from 'src/models/category.model';
import { IsCategoryUniqueConstraint } from 'src/validators/is_category_unique/is-category-unique.validator';
import { RessourceModule } from './ressource.module';
import { CategoryController } from 'src/controller/category.controller';

@Module({
  controllers: [CategoryController],
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => RessourceModule)],
  providers: [CategoryService, IsCategoryUniqueConstraint],
  exports: [CategoryService],
})
export class CategoryModule {}
