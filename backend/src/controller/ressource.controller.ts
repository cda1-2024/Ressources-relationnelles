import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CollectRessourceDto } from 'src/dto/ressource/collect-ressource.dto';
import { CreateRessourceDto } from 'src/dto/ressource/create-ressource.dto';
import { UpdateRessourceDto } from 'src/dto/ressource/update-ressource.dto';

@ApiTags('Ressources')
@Controller('api/ressources')
export class RessrouceController {
  //Créer un ressource
  @Post('/')
  @ApiOperation({
    summary: 'Créer un ressource',
    description:
      'Créer une ressource avec un titre, statut, visibilité catégorie, texte et contenu. Le contenu peut être un document, image, vidéo, etc...',
  })
  @ApiBody({
    type: CreateRessourceDto,
    description: 'Structure du json pour créer une ressource',
  })
  @ApiResponse({
    status: 201,
    description: 'La ressource a été créé avec succès',
    schema: {
      example: {
        id: 1,
        user_id: 25,
        title: 'Exemple de titre',
        description: 'Exemple de titre',
        content_text: 'Exemple de content',
        conent_link: 'Exemple de contenu',
        created_at: 'datetime',
        category: 'Exemple de catégorie',
        visibilty: 1,
        status: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La création de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: "La ressource n'pas été crée",
      },
    },
  })
  async create(@Body() CreateRessourceDto: CreateRessourceDto) {}

  //Récupérer une ressource / des ressources
  @Get('/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources (publiques et restreint)',
    description:
      'Récupérer la liste des ressourcess en fonction des critères fournis',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: Number,
    description: 'Doit être un entier',
  })
  @ApiQuery({ name: 'title',    required: false,    type: String  })
  @ApiQuery({ name: 'dateInterval1', required: false, type: Date })
  @ApiQuery({ name: 'dateInterval2', required: false, type: Date })
  @ApiQuery({ name: 'visibility', required: false, type: Boolean })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'La ressource a été trouvée avec succès',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Exemple de titre',
            category: 'Exemple de catégorie',
            content_link: 'Exemple de contenu',
            content_text: 'Exemple de contenu',
            status: 0,
            dateTimeValidation: '2025-03-14T10:00:00Z',
            isRestricted: false,
            suspended: false,
            deleted: false,
            createdAt: '2025-03-14T10:00:00Z',
            user: {
              id: 1,
              usernme: 'username',
            },
            ressourceType: {
              id: 1,
              name: 'Type de ressource',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La recherche de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "La ressource n'a pas été trouvée",
    schema: {
      example: {
        status: 'error',
        message: "La ressource n'a pas été trouvée",
      },
    },
  })
  findRessource(): null {
    return null;
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
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'La ressource a été mise à jour avec succès',
    schema: {
      example: {
        data: {
          id: 1,
          title: 'Exemple de titre mis à jour',
          content_link: 'Exemple de contenu mis à jour',
          content_text: 'Exemple de contenu mis à jour',
          category: 'Exemple de catégorie mise à jour',
          status: 2,
          dateTimeValidation: '2025-03-14T10:00:00Z',
          isRestricted: true,
          suspended: true,
          deleted: true,
          createdAt: '2025-03-14T10:00:00Z',
          updatedAt: '2025-03-14T10:00:00Z',
          user: {
            id: 1,
            usernme: 'username',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "La ressource n'a pas été trouvée",
    schema: {
      example: {
        status: 'error',
        message: "La ressource n'a pas été trouvée",
      },
    },
  })
  updateRessource(): null {
    return null;
  }

  //Récupérer des ressources publiques
  @Get('/public')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources publiques',
    description:
      'Récupérer la liste des ressources publiques en fonction des critères fournis',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: Number,
    description: 'Doit être un entier',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Titre de la ressource',
  })
  @ApiQuery({
    name: 'sortByDate',
    required: false,
    type: Boolean,
    description: 'Trier par date de création (du plus récent au plus ancien)',
  })
  @ApiResponse({
    status: 200,
    description: 'La ressource publique a été trouvée avec succès',
    schema: {
      example: {
        data: [
          {
            id: 1,
            user_id: 25,
            title: 'Exemple de titre',
            content_text: 'écris toi même',
            content_link: 'description',
            created_at: 'username',
            content: 'Exemple de contenu',
            createdAt: '2025-03-14T10:00:00Z',
            ressourceType: {
              id: 1,
              name: 'Type de ressource',
            },
            category: {
              id: 1,
              name: 'Catégorie',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "La ressource publique n'a pas été trouvée",
    schema: {
      example: {
        status: 'error',
        message: "La ressource publique n'a pas été trouvée",
      },
    },
  })
  findRessourcePublic(): null {
    return null;
  }

  // Récupérer une ressource par ID
  @Get('/:id')
  @ApiOperation({
    summary: 'Récupérer une ressource par ID',
    description: "Récupérer une ressource en fonction de l'identifiant fourni",
  })
  @ApiQuery({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'La ressource a été trouvée avec succès',
    schema: {
      example: {
        id: 1,
        title: 'Exemple de titre',
        content_text: 'description',
        content_link: 'Exemple de contenu',
        created_at: 'username',
        category: 'Exemple de catégorie',
        visibilty: 1,
        status: 1,
        createdAt: '2025-03-14T10:00:00Z',
        updatedAt: '2025-03-14T10:00:00Z',
        user: {
          id: 1,
          usernme: 'username',
        },
        ressourceType: {
          id: 1,
          name: 'Type de ressource',
        },
        comments: [
          {
            id: 1,
            id_user: 2,
            content: 'Exemple de commentaire',
            createdAt: '2025-03-14T10:00:00Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La recherche de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "La ressource n'a pas été trouvée",
    schema: {
      example: {
        status: 'error',
        message: "La ressource n'a pas été trouvée",
      },
    },
  })
  findOne(): null {
    return null;
  }

  @Post('/collect/:id')
  @ApiOperation({
    summary:
      'Sauvegarder une ressource en tant que favori ou a regarder plus tard',
    description:
      'Sauvegarder une ressource en tant que favori/regarder plus tard pour l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: Number })
  @ApiBody({
    type: CollectRessourceDto,
    description: 'Structure du JSON pour sauvegarder une ressource',
  })
  @ApiResponse({
    status: 200,
    description: 'La ressource a été sauvegardée avec succès',
    schema: {
      example: {
        status: 'success',
        message: 'Ressource sauvegardée avec succès',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La sauvegarde de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la sauvegarde de la ressource',
      },
    },
  })
  saveBookmark(): null {
    return null;
  }
  @Put('/uncollect/:id')
  @ApiOperation({
    summary:
      'Supprimer une ressource de la liste des favoris ou à regarder plus tard',
    description:
      'Supprimer une ressource de la liste des favoris ou à regarder plus tard pour l’utilisateur connecté',
  })
  @ApiQuery({ name: 'id', required: true, type: Number })
  @ApiBody({
    type: CollectRessourceDto,
    description: 'Structure du JSON pour supprimer une ressource',
  })
  @ApiResponse({
    status: 200,
    description: 'La ressource a été supprimée avec succès',
    schema: {
      example: {
        status: 'success',
        message: 'Ressource supprimée avec succès',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La suppression de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la suppression de la ressource',
      },
    },
  })
  deleteRessourceInMyCollection(): null {
    return null;
  }
}
