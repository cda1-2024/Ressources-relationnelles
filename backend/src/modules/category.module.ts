import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from 'src/services/category.service';
import { Category } from 'src/models/category.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category])
  ],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
