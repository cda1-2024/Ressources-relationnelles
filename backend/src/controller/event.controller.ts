import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEventRequestDto } from 'src/dto/event/request/create-event.dto';
import { FilterEventRequestDto } from 'src/dto/event/request/filter-event.dto';
import { FullEventResponseDto } from 'src/dto/event/response/full-event-response.dto';
import { EventListResponseDto, EventResponseDto } from 'src/dto/event/response/list-event-response.dto';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';
import { Roles } from 'src/middleware/guards/roles.decorator';
import { RolesGuard } from 'src/middleware/guards/roles.guard';
import { User, UserRole } from 'src/models/user.model';
import { EventMapper } from 'src/services/event/event.mapper';
import { EventService } from 'src/services/event/event.service';

@ApiTags('Events')
@Controller('api/events/')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Créer un évènement',
    description: 'Créer une évènement.',
  })
  @ApiBody({
    type: CreateEventRequestDto,
    description: 'Structure du json pour créer un évènement',
  })
  @ApiCreatedResponse({
    description: "L'évènement a été créé avec succès",
    type: EventResponseDto,
  })
  @ApiBadRequestResponse({
    description: "La création de l'évènement a échoué",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async create(@Body() createEventDto: CreateEventRequestDto, @CurrentUser() user: User): Promise<EventResponseDto> {
    const event = await this.eventService.createEvent(user, createEventDto);
    return EventMapper.toResponseDto(event);
  }

  @Get('/filter/')
  @ApiOperation({
    summary: 'Récupérer la liste des évènements à l’aide de filtres',
    description: 'Récupérer la liste des évènements publiques en fonction des critères fournis',
  })
  @ApiExtraModels(FilterEventRequestDto)
  @ApiOkResponse({
    description: 'Le ou les évènements ont été trouvées avec succès',
    type: EventListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche a échoué',
  })
  async findEvents(@Query() filters: FilterEventRequestDto): Promise<EventListResponseDto> {
    const { events, total } = await this.eventService.findEventsBySearch(null, filters);
    return EventMapper.toResponseListDto(events, filters.page, filters.pageSize, total);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Récupérer un évènement par ID',
    description: "Récupérer un évènement en fonction de l'identifiant fourni",
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: "L'évènement a été trouvée avec succès",
    type: FullEventResponseDto,
  })
  @ApiBadRequestResponse({
    description: "L'évènement de la ressource a échoué",
  })
  @ApiNotFoundResponse({
    description: "L'évènement n'a pas été trouvée",
  })
  async getEventById(@Param('id') id: string): Promise<FullEventResponseDto> {
    const event = await this.eventService.findEventById(id);
    return EventMapper.toFullResponseDto(event);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Récupérer la liste des évènements',
    description: 'Récupérer la liste des évènements en fonction des critères fournis',
  })
  @ApiOkResponse({
    description: 'Le ou les évènements ont été trouvées avec succès',
    type: EventListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La recherche a échoué',
  })
  async getEvents(): Promise<EventListResponseDto> {
    const events = await this.eventService.findEventAll();
    return EventMapper.toResponseListDto(events, 1, 10000, events.length);
  }

  @Post('/participate/:id')
  @ApiOperation({
    summary: 'Enregistrer une participation d’un évènement par l’utilisateur connecté',
    description: 'Enregistrer une participation d’un évènement par l’utilisateur connecté',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'La participation à l’évènement a été enregistrée avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La participation à l’évènement a échoué',
  })
  @ApiNotFoundResponse({
    description: "L’évènement n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async participateEvent(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.eventService.participateEvent(user, id);
  }

  @Put('/suspend/:id')
  @ApiOperation({
    summary: 'Suspendre un évènement par ID',
    description: 'Suspendre un évènement en fonction de l’identifiant fourni',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'L’évènement a été suspendu avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La suspension de l’évènement a échoué',
  })
  @ApiNotFoundResponse({
    description: "L’évènement n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'))
  async suspendEvent(@Param('id') id: string): Promise<void> {
    await this.eventService.suspendEvent(id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Supprimer un évènement par ID',
    description: 'Supprimer un évènement en fonction de l’identifiant fourni',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'L’évènement a été supprimé avec succès',
    type: EventResponseDto,
  })
  @ApiBadRequestResponse({
    description: "La suppression de l'évènement a échoué",
  })
  @ApiNotFoundResponse({
    description: "L’évènement n'a pas été trouvée",
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR)
  async deleteEvent(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.eventService.deleteEvent(id);
    return EventMapper.toResponseDto(event);
  }
}
