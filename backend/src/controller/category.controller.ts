import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from 'src/services/category/category.service';
import { CategoryMapper } from 'src/services/category/category.mapper';
import { FullCategoryResponseDto } from 'src/dto/category/response/full-category-response.dto';
import { ListCategoryResponseDto } from 'src/dto/category/response/list-category-response.dto';
import { CreateCategoryDto } from 'src/dto/category/request/create-category.dto';
import { Category } from 'src/models/category.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCategoryDto } from 'src/dto/category/request/update-category.dto';
import { User, UserRole } from 'src/models/user.model';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';
import { FilterCategoryRequestDto } from 'src/dto/category/request/filter-category.dto';
import { RolesGuard } from 'src/middleware/guards/roles.guard';
import { Roles } from 'src/middleware/guards/roles.decorator';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @ApiOperation({ summary: 'Récupérer la liste des catégories à l’aide de filtres' })
  @ApiOkResponse({
    description: 'Récupérer la liste des catégories à l’aide de filtres',
    type: ListCategoryResponseDto,
  })
  async getAllCategories(): Promise<ListCategoryResponseDto> {
    const categories = await this.categoryService.getCategoryAll();
    return CategoryMapper.toResponseListDto(categories, 1, 1000, categories.length);
  }

  @Get('/filter')
  @ApiOperation({ summary: 'Lister tous les catégories' })
  @ApiExtraModels(FilterCategoryRequestDto)
  @ApiOkResponse({
    description: 'La ou les catégories ont été trouvées avec succès',
    type: ListCategoryResponseDto,
  })
  async findCategoriesBySearch(@Query() filter: FilterCategoryRequestDto): Promise<ListCategoryResponseDto> {
    const { categories, total } = await this.categoryService.findCategoriesBySearch(filter);
    return CategoryMapper.toResponseListDto(categories, filter.page, filter.pageSize, total);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Récupérer une catégorie par son ID' })
  @ApiOkResponse({
    description: 'La catégorie a été trouvée avec succès',
    type: FullCategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: "La catégorie n'a pas été trouvée",
  })
  async getCategoryById(@Param('id') id: string): Promise<FullCategoryResponseDto> {
    const category = await this.categoryService.findCategoryById(id);
    return CategoryMapper.toResponseFullDto(category);
  }

  @Post('/')
  @ApiOperation({ summary: 'Créer une nouvelle catégorie' })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Les informations de la catégorie à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'La catégorie a été créée avec succès',
    type: FullCategoryResponseDto,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async createCategory(
    @CurrentUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<FullCategoryResponseDto> {
    const category: Category = await this.categoryService.createCategory(createCategoryDto, user);
    return CategoryMapper.toResponseFullDto(category);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Les informations de la catégorie à mettre à jour',
  })
  @ApiOkResponse({
    description: 'La catégorie a été mise à jour avec succès',
    type: FullCategoryResponseDto,
  })
  @UseGuards(AuthGuard('jwt'))
  async updateCategory(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCategory: UpdateCategoryDto,
  ): Promise<FullCategoryResponseDto> {
    const categoryUpdated = await this.categoryService.updateCategory(id, updateCategory, user);
    return CategoryMapper.toResponseFullDto(categoryUpdated);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'La catégorie a bien été supprimé',
    example: {
      deleted: true,
    },
  })
  @UseGuards(AuthGuard('jwt'))
  async deleteCategory(@Param('id') id: string): Promise<{ deleted: boolean } | void> {
    const result = await this.categoryService.deleteCategory(id);
    if (result == true) {
      return { deleted: true };
    }
  }
}
