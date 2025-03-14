import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRessourceDto } from 'src/dto/ressource/create-ressource.dto';
import { UpdateRessourceDto } from 'src/dto/ressource/update-ressource.dto';

@ApiTags('Ressources')
@Controller('resources')
export class RessrouceController {
  //Créer un ressource
  @Post('/')
  @ApiOperation({
    summary: 'Créer un ressource',
    description:
      'Créer une ressoruce avec un titre, statut, visibilité catégorie, texte et contenu. Le contenu peut être un document, image, vidéo, etc...',
  })
  @ApiBody({
    type: CreateRessourceDto,
    description: 'Structure du json pour créer une ressoruce',
  })
  @ApiResponse({
    status: 201,
    description: 'La ressource a été créé avec succès',
    schema: {
      example: {
        id: 1,
        title: 'Exemple de titre',
        content_text: 'Exemple de titre',
        content: 'Exemple de content',
        category: 'Exemple de catégorie',
        visibilty: 'Exemple de visibilité',
        state: 'Exemple de statut',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La création de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: "La ressoruce n'pas été crée",
      },
    },
  })
  async create(@Body() CreateRessourceDto: CreateRessourceDto) {}

  //Récupérer une ressource / des ressources
  @Get('/')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources (publiques et restreint)',
    description:
      "Récupérer la liste des ressourcess en fonction des critères fournis, cette route ne peut qu'être utilisée par un administrateur",
  })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'dateCreation', required: false, type: String })
  @ApiQuery({ name: 'adminValidation', required: false, type: Boolean })
  @ApiQuery({ name: 'isRestricted', required: false, type: Boolean })
  @ApiQuery({ name: 'suspended', required: false, type: Boolean })
  @ApiQuery({ name: 'deleted', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'La ressource a été trouvée avec succès',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Exemple de titre',
            content: 'Exemple de contenu',
            adminValidation: true,
            dateTimeValidation: '2025-03-14T10:00:00Z',
            isRestricted: false,
            suspended: false,
            deleted: false,
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
          content: 'Exemple de contenu mis à jour',
          category: 'Exemple de catégorie mise à jour',
          adminValidation: true,
          dateTimeValidation: '2025-03-14T10:00:00Z',
          isRestricted: true,
          suspended: true,
          deleted: true,
          createdAt: '2025-03-14T10:00:00Z',
          updatedAt: '2025-03-14T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La mise à jour de la ressource a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'La mise à jour de la ressource a échoué',
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
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'dateCreation', required: false, type: String })
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
            title: 'Exemple de titre',
            content_text: 'Exemple de contenu text',
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
    status: 400,
    description: 'La recherche de la ressource publique a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
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
        content_text: 'Exemple de contenu text',
        created_at: 'username',
        content: 'Exemple de contenu',
        category: 'Exemple de catégorie',
        visibilty: 'Exemple de visibilité',
        state: 'Exemple de statut',
        createdAt: '2025-03-14T10:00:00Z',
        updatedAt: '2025-03-14T10:00:00Z',
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
    // Logique pour récupérer une ressource par ID
    return null;
  }

  // Récupérer des ressources signalées
  @Get('/reported')
  @ApiOperation({
    summary: 'Récupérer la liste des ressources signalées',
    description:
      'Récupérer la liste des ressources signalées par les utilisateurs',
  })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'dateCreation', required: false, type: String })
  @ApiQuery({
    name: 'sortByDate',
    required: false,
    type: Boolean,
    description: 'Trier par date de création (du plus récent au plus ancien)',
  })
  @ApiResponse({
    status: 200,
    description: 'Les ressources signalées ont été trouvées avec succès',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Exemple de ressource signalé',
            created_at: 'username',
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
    status: 400,
    description: 'La recherche des ressources signalées a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Les ressources signalées n'ont pas été trouvées",
    schema: {
      example: {
        status: 'error',
        message: "Les ressources signalées n'ont pas été trouvées",
      },
    },
  })
  findReportedRessources(): null {
    return null;
  }

  // Récupérer une ressource signalée par ID
  @Get('/reported/:id')
  @ApiOperation({
    summary: 'Récupérer une ressource signalée par ID',
    description:
      "Récupérer une ressource signalée en fonction de l'identifiant fourni",
  })
  @ApiQuery({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'La ressource signalée a été trouvée avec succès',
    schema: {
      example: {
        id: 1,
        title: 'Exemple de ressource signalé',
        created_at: 'username',
        createdAt: '2025-03-14T10:00:00Z',
        content_text : 'Exemple de contenu text',
        content: 'Exemple de contenu',
        ressourceType: {
          id: 1,
          name: 'Type de ressource',
        },
        category: {
          id: 1,
          name: 'Catégorie',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'La recherche de la ressource signalée a échoué',
    schema: {
      example: {
        status: 'error',
        message: 'Échec de la demande',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "La ressource signalée n'a pas été trouvée",
    schema: {
      example: {
        status: 'error',
        message: "La ressource signalée n'a pas été trouvée",
      },
    },
  })
  findReportedRessourceById(): null {
    return null;
  }
}
