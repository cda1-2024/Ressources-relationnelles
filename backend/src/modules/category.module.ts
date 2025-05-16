import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from 'src/services/category/category.service';
import { Category } from 'src/models/category.model';
import { IsCategoryUniqueConstraint } from 'src/validators/is_category_unique/is_category_unique.validator';
import { RessourceModule } from './ressource.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => RessourceModule)],
  providers: [CategoryService, IsCategoryUniqueConstraint],
  exports: [CategoryService],
})
export class CategoryModule {}
