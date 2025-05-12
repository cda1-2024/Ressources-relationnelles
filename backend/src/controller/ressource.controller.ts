import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
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
import { CollectRessourceDto } from 'src/dto/ressource/collect-ressource.dto';
import { CreateRessourceDto } from 'src/dto/ressource/create-ressource.dto';
import { FilterRessourceDto } from 'src/dto/ressource/filter-ressource.dto';
import { FullRessourceResponseDto } from 'src/dto/ressource/full-ressource-response.dto';
import {
  RessourceListResponseDto,
  RessourceResponseDto,
} from 'src/dto/ressource/ressource-response.dto';
import { UpdateRessourceDto } from 'src/dto/ressource/update-ressource.dto';
import { ValidateRessourceDto } from 'src/dto/ressource/validate-ressource.dto';
import { RessourceService } from 'src/services/ressource/ressource.service';

@ApiTags('Ressources')
@Controller('api/ressources')
export class RessrouceController {
  constructor(private readonly ressourceService: RessourceService) {}
  //Créer un ressource
  @Post('/')
  @ApiOperation({
    summary: 'Créer une ressource',
    description:
      'Créer une ressource avec un titre, statut, visibilité catégorie, texte et contenu. Le contenu peut être un document, image, vidéo, etc...',
  })
  @ApiBody({
    type: CreateRessourceDto,
    description: 'Structure du json pour créer une ressource',
  })
  @ApiCreatedResponse({
    description: 'La ressource a été créé avec succès',
    type: RessourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La création de la ressource a échoué',
  })
  async create(@Body() createRessourceDto: CreateRessourceDto, @Req() req) {
    try {
      const user = req.user;
      const ressource =
        await this.ressourceService.createRessource(user, createRessourceDto);
      return ressource;
    } catch (error) {
      throw new BadRequestException('La création de la ressource a échoué');
    }
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
  async getRessourceById(
    @Param() params,
  ): Promise<FullRessourceResponseDto | { status: string; message: string }> {
    const id: string = params.id;
    const ressource =
      await this.ressourceService.findRessourceById(id);
    if (!ressource) {
      throw new NotFoundException("La ressource n'a pas été trouvée");
    }
    return ressource;
  }

  //Récupérer une ressource / des ressources
  @Get('/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources (publiques et restreintes)',
    description:
      'Récupérer la liste des ressourcess en fonction des critères fournis',
  })
  @ApiExtraModels(FilterRessourceDto)
  @ApiQuery({
    name: 'filters',
    required: false,
    type: FilterRessourceDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiOkResponse({
    description: 'La ou les ressources ont été trouvées avec succès',
    type: RessourceListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche de la ressource a échoué',
  })
  async getRessources(): Promise<RessourceListResponseDto | { status: string; message: string }> {
    try {
      const ressources = await this.ressourceService.findRessourceAll();
      return ressources;
    } catch (error) {
      throw new BadRequestException('La recherche de la ressource a échoué');
    }
  }

  //Récupérer une ressource / des ressources à l'aide de filtres
  @Get('/filter/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources à l’aide de filtres',
    description:
      'Récupérer la liste des ressourcess en fonction des critères fournis',
  })
  @ApiExtraModels(FilterRessourceDto)
  @ApiOkResponse({
    description: 'La ou les ressources ont été trouvées avec succès',
    type: RessourceListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche de la ressource a échoué',
  })
  async findRessources(@Query() filters: FilterRessourceDto, @Req() req) {
    const user = req.user || null;
    console.log('user', user);
    console.log('filters');
    return this.ressourceService.findRessourcesBySearch(user, filters);
  }

  // Mettre à jour une ressource
  @Put('/:id')
  @ApiOperation({
    summary: 'Modifier une ressource',
    description: "Modifier une ressource en fonction de l'identifiant",
  })
  @ApiBody({
    type: UpdateRessourceDto,
    description: 'Structure du JSON pour mettre à jour une ressource',
  })
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiOkResponse({
    description: 'La ressource a été mise à jour avec succès',
    type: RessourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La mise à jour de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  async updateRessource(
    @Body() updateRessourceDto: UpdateRessourceDto,
    @Param() params,
  ) {
    try {
      const ressource = await this.ressourceService.updateRessource(
        params.id,
        updateRessourceDto,
      );
      if (!ressource) {
        throw new NotFoundException("La ressource n'a pas été trouvée");
      }
      return ressource;
    } catch (error) {
      throw new BadRequestException('La mise à jour de la ressource a échoué');
    }
  }

  // Sauvegarder une ressource en tant que favori ou a regarder plus tard
  @Post('/collect/:id')
  @ApiOperation({
    summary:
      'Sauvegarder une ressource en tant que favori ou a regarder plus tard',
    description:
      'Sauvegarder une ressource en tant que favori/regarder plus tard pour l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({
    type: CollectRessourceDto,
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
  async saveBookmark(
    @Body() collectRessourceDto: CollectRessourceDto,
    @Param() params,
    @Req() req,
  ): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new BadRequestException(
        'L\'utilisateur n\'est pas connecté ou n\'existe pas',
      );
    }
    try {
      await this.ressourceService.saveBookmark(
        user,
        params.id,
        collectRessourceDto.type,
      );
    } catch (error) {
      throw new BadRequestException('La sauvegarde de la ressource a échoué');
    }
  }

  @Put('/uncollect/:id')
  @ApiOperation({
    summary:
      'Supprimer une ressource de la liste des favoris ou à regarder plus tard',
    description:
      'Supprimer une ressource de la liste des favoris ou à regarder plus tard pour l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({
    type: CollectRessourceDto,
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
  async deleteBookmark(
    @Body() collectRessourceDto: CollectRessourceDto,
    @Param() params,
    @Req() req,
  ): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new BadRequestException(
        'L\'utilisateur n\'est pas connecté ou n\'existe pas',
      );
    }
    try {
      await this.ressourceService.saveBookmark(
        user,
        params.id,
        collectRessourceDto.type,
      );
    } catch (error) {
      throw new BadRequestException('La suppression de la sauvegarde a échoué');
    }
  }

  @Put('/validate/:id')
  @ApiOperation({
    summary:
      'Valider une ressource par le modérateur connecté',
    description:
      'Valider une ressource par le modérateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({
    type: ValidateRessourceDto,
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
  async changeStatus(
    @Body() validateRessourceDto: ValidateRessourceDto,
    @Param() params,
    @Req() req,
  ): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new BadRequestException(
        'L\'utilisateur n\'est pas connecté ou n\'existe pas',
      );
    }
    try {
      await this.ressourceService.validateRessource(
        user,
        params.id,
        validateRessourceDto.validate,
      );
    } catch (error) {
      throw new BadRequestException('La suppression de la sauvegarde a échoué');
    }
  }

  @Post('/consulte/:id')
  @ApiOperation({
    summary:
      'Enregistrer une consultation d’une ressource par l’utilisateur connecté',
    description:
      'Enregistrer une consultation d’une ressource par l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'La ressource a été consulté avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La consultation de la ressource a échoué',
  })
  @ApiNotFoundResponse({
    description: "La ressource n'a pas été trouvée",
  })
  async consulteRessource(
    @Param() params,
    @Req() req,
  ): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new BadRequestException(
        'L\'utilisateur n\'est pas connecté ou n\'existe pas',
      );
    }
    try {
      await this.ressourceService.consulteRessource(
        user,
        params.id,
      );
    } catch (error) {
      throw new BadRequestException('La sauvegarde de la ressource a échoué');
    }
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Supprimer une ressource par ID',
    description:
      'Supprimer une ressource en fonction de l’identifiant fourni',
  })
  @ApiQuery({ name: 'id', required: true, type: String })
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
  async deleteRessource(
    @Param() params,
  ): Promise<RessourceResponseDto | null> {
    try {
      const ressource = await this.ressourceService.deleteRessource(
        params.id,
      );
      if (!ressource) {
        throw new NotFoundException("La ressource n'a pas été trouvée");
      }
      return ressource;
    } catch (error) {
      throw new BadRequestException('La suppression de la ressource a échoué');
    }
  }
}
