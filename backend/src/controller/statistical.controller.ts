import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Statisticals')
@Controller('api/statisticals/')
export class StatisticalController {
  @Get('/viewed-ressources')
  @ApiQuery({ name: 'idUser', required: false, type: Number })
  @ApiQuery({ name: 'idRessource', required: false, type: Number })
  getViewedResourcesStats(): null {
    return null;
  }

  @Get('/searched-ressources')
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'idRessource', required: false, type: Number })
  getSearchdRessourcesStats(): null {   
    return null;
  }

  @Get('/saved-ressources')
  @ApiQuery({ name: 'idUser', required: false, type: Number })
  @ApiQuery({ name: 'idRessource', required: false, type: Number })
  getSavedRessourcesStats(): null {
    return null;
  }
}
