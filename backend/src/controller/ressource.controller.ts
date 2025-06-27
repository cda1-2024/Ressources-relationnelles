import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CollectRessourceRequestDto } from 'src/dto/ressource/request/collect-ressource.dto';
import { CreateRessourceRequestDto } from 'src/dto/ressource/request/create-ressource.dto';
import { FilterRessourceRequestDto } from 'src/dto/ressource/request/filter-ressource.dto';
import { FullRessourceResponseDto } from 'src/dto/ressource/response/full-ressource-response.dto';
import { RessourceListResponseDto, RessourceResponseDto } from 'src/dto/ressource/response/list-ressource-response.dto';
import { UpdateRessourceRequestDto } from 'src/dto/ressource/request/update-ressource.dto';
import { ValidateRessourceRequestDto } from 'src/dto/ressource/request/validate-ressource.dto';
import { RessourceService } from 'src/services/ressource/ressource.service';
import { RessourceMapper } from 'src/services/ressource/ressource.mapper';
import { User, UserRole } from 'src/models/user.model';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/middleware/guards/roles.guard';
import { Roles } from 'src/middleware/guards/roles.decorator';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';

@ApiTags('Ressources')
@Controller('api/ressources')
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Créer une ressource',
    description:
      'Créer une ressource avec un titre, statut, visibilité catégorie, texte et contenu. Le contenu peut être un document, image, vidéo, etc...',
  })
  @ApiBody({
    type: CreateRessourceRequestDto,
    description: 'Structure du json pour créer une ressource',
  })
  @ApiCreatedResponse({
    description: 'La ressource a été créé avec succès',
    type: RessourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La création de la ressource a échoué',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async create(
    @Body() createRessourceDto: CreateRessourceRequestDto,
    @CurrentUser() user: User,
  ): Promise<RessourceResponseDto> {
    const ressource = await this.ressourceService.createRessource(user, createRessourceDto);
    return RessourceMapper.toResponseDto(ressource);
  }

  //Récupérer une ressource / des ressources à l'aide de filtres
  @Get('/filterpublic/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources à l’aide de filtres',
    description: 'Récupérer la liste des ressources publiques en fonction des critères fournis',
  })
  @ApiExtraModels(FilterRessourceRequestDto)
  @ApiOkResponse({
    description: 'La ou les ressources ont été trouvées avec succès',
    type: RessourceListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche de la ressource a échoué',
  })
  async findPublicRessources(@Query() filters: FilterRessourceRequestDto): Promise<RessourceListResponseDto> {
    const { ressources, total } = await this.ressourceService.findRessourcesBySearch(null, filters, false);
    const listRessourceLikedByUser: RessourceListResponseDto = RessourceMapper.toResponseListDto(
      ressources,
      filters.page,
      filters.pageSize,
      total,
    );

    return this.ressourceService.isRessourceLikedByUser(listRessourceLikedByUser);
  }

  @Get('/filter/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources à l’aide de filtres',
    description: 'Récupérer la liste des ressources publiques et restreintes en fonction des critères fournis',
  })
  @ApiExtraModels(FilterRessourceRequestDto)
  @ApiOkResponse({
    description: 'La ou les ressources ont été trouvées avec succès',
    type: RessourceListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche de la ressource a échoué',
  })
  @UseGuards(AuthGuard('jwt'))
  async findRessources(
    @Query() filters: FilterRessourceRequestDto,
    @CurrentUser() user: User,
  ): Promise<RessourceListResponseDto> {
    const { ressources, total } = await this.ressourceService.findRessourcesBySearch(user, filters, true);
    const listRessourceLikedByUser: RessourceListResponseDto = RessourceMapper.toResponseListDto(
      ressources,
      filters.page,
      filters.pageSize,
      total,
    );
    return this.ressourceService.isRessourceLikedByUser(listRessourceLikedByUser, user.id);
  }

  // Récupérer une ressource par ID
  @Get('/:id')
  @ApiOperation({
    summary: 'Récupérer une ressource par ID',
    description: "Récupérer une ressource en fonction de l'identifiant fourni",
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'La ressource a été trouvée avec succès',
    type: FullRessourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  async getRessourceById(@Param('id') id: string): Promise<FullRessourceResponseDto> {
    const ressource = await this.ressourceService.findRessourceById(id);
    return RessourceMapper.toFullResponseDto(ressource);
  }

  //Récupérer une ressource / des ressources
  @Get('/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources (publiques et restreintes)',
    description: 'Récupérer la liste des ressources en fonction des critères fournis',
  })
  @ApiOkResponse({
    description: 'La ou les ressources ont été trouvées avec succès',
    type: RessourceListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche a échoué',
  })
  async getRessources(): Promise<RessourceListResponseDto> {
    const ressources = await this.ressourceService.findRessourceAll();
    return RessourceMapper.toResponseListDto(ressources, 1, 10000, ressources.length);
  }

  // Mettre à jour une ressource
  @Put('/:id')
  @ApiOperation({
    summary: 'Modifier une ressource',
    description: "Modifier une ressource en fonction de l'identifiant",
  })
  @ApiBody({
    type: UpdateRessourceRequestDto,
    description: 'Structure du JSON pour mettre à jour une ressource',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'La ressource a été mise à jour avec succès',
    type: RessourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Aucune donnée à mettre à jour',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async updateRessource(
    @Body() updateRessourceDto: UpdateRessourceRequestDto,
    @Param('id') id: string,
  ): Promise<RessourceResponseDto> {
    const ressource = await this.ressourceService.updateRessource(id, updateRessourceDto);
    return RessourceMapper.toResponseDto(ressource);
  }

  // Sauvegarder une ressource en tant que favori ou a regarder plus tard
  @Post('/collect/:id')
  @ApiOperation({
    summary: 'Sauvegarder une ressource en tant que favori ou a regarder plus tard',
    description: 'Sauvegarder une ressource en tant que favori/regarder plus tard pour l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({
    type: CollectRessourceRequestDto,
    description: 'Structure du JSON pour sauvegarder une ressource',
  })
  @ApiOkResponse({
    description: 'La ressource a été sauvegardée avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La sauvegarde de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async saveBookmark(
    @Body() collectRessourceDto: CollectRessourceRequestDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.ressourceService.saveBookmark(user, id, collectRessourceDto.type);
  }

  @Put('/uncollect/:id')
  @ApiOperation({
    summary: 'Supprimer une ressource de la liste des favoris ou à regarder plus tard',
    description: 'Supprimer une ressource de la liste des favoris ou à regarder plus tard pour l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({
    type: CollectRessourceRequestDto,
    description: 'Structure du JSON pour supprimer une ressource',
  })
  @ApiOkResponse({
    description: 'La sauvegarde de la ressource a été supprimé avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La suppression de la sauvegarde a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async deleteBookmark(
    @Body() collectRessourceDto: CollectRessourceRequestDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.ressourceService.saveBookmark(user, id, collectRessourceDto.type);
  }

  @Put('/validate/:id')
  @ApiOperation({
    summary: 'Valider une ressource par le modérateur connecté',
    description: 'Valider une ressource par le modérateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({
    type: ValidateRessourceRequestDto,
    description: 'Structure du JSON pour supprimer une ressource',
  })
  @ApiOkResponse({
    description: 'La ressource a été validé avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La validation de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MODERATOR)
  async validate(
    @Body() validateRessourceDto: ValidateRessourceRequestDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<FullRessourceResponseDto> {
    const ressource = await this.ressourceService.validateRessource(user, id, validateRessourceDto.validate);
    return RessourceMapper.toFullResponseDto(ressource);
  }

  @Post('/consulte/:id')
  @ApiOperation({
    summary: 'Enregistrer une consultation d’une ressource par l’utilisateur connecté',
    description: 'Enregistrer une consultation d’une ressource par l’utilisateur connecté',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'La ressource a été consulté avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La consultation de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'))
  async consulteRessource(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.ressourceService.consulteRessource(user, id);
  }

  // Supprimer une ressource
  @Delete('/:id')
  @ApiOperation({
    summary: 'Supprimer une ressource par ID',
    description: 'Supprimer une ressource en fonction de l’identifiant fourni',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'La ressource a été supprimée avec succès',
    type: RessourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La suppression de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR)
  async deleteRessource(@Param('id') id: string): Promise<RessourceResponseDto> {
    const ressource = await this.ressourceService.deleteRessource(id);
    return RessourceMapper.toResponseDto(ressource);
  }
}
