import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { Not } from 'typeorm';
import { CreateCategoryDto } from 'src/dto/category/request/create-category.dto';
import { Category } from 'src/models/category.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCategoryDto } from 'src/dto/category/request/update-category.dto';
import { BlockList } from 'net';
import { BlobOptions } from 'buffer';
import { ok } from 'assert';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @ApiOperation({ summary: 'Lister tous les catégories' })
  @ApiOkResponse({
    description: 'La ou les catégories ont été trouvées avec succès',
    type: ListCategoryResponseDto,
  })
  async getAllCategories(): Promise<ListCategoryResponseDto | []> {
    const categories = await this.categoryService.getCategoryAll();
    if (categories == undefined) {
      return [];
    }
    return CategoryMapper.toResponseListDto(categories);
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
    if (category == null) {
      throw new NotFoundException("La catégorie n'a pas été trouvée");
    }
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
  @UseGuards(AuthGuard('jwt'))
  async createCategory(@Req() req, @Body() createCategoryDto: CreateCategoryDto): Promise<FullCategoryResponseDto> {
    if (
      createCategoryDto.name == undefined ||
      createCategoryDto.color == undefined ||
      createCategoryDto.icon == undefined
    ) {
      throw new BadRequestException('Les champs name, icon et color sont requis');
    }

    const user = req.user;
    const category = new Category();
    category.name = createCategoryDto.name;
    category.color = createCategoryDto.color;
    category.iconPath = createCategoryDto.icon;
    category.lastAutor = user;

    return this.categoryService.createCategory(category).then((category) => {
      return CategoryMapper.toResponseFullDto(category);
    });
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
    @Req() req,
    @Param('id') id: string,
    @Body() updateCategory: UpdateCategoryDto,
  ): Promise<FullCategoryResponseDto> {
    const categoryUpdated = await this.categoryService.updateCategory(id, updateCategory, req.user);
    return CategoryMapper.toResponseFullDto(categoryUpdated!);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'La catégorie a bien été supprimé',
    example: {
      deleted: true,
    },
  })
  @UseGuards(AuthGuard('jwt'))
  async deleteCategory(@Param('id') id: string, @Req() req) {
    const user = req.user;
    const result: boolean = await this.categoryService.deleteCategory(id, user);
    if (result) {
      return { deleted: true };
    }
  }
}
