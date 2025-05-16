import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from 'src/dto/event/create-event.dto';

@ApiTags('Events')
@Controller('api/envents/')
export class EventController {
  @Post('/create')
  @ApiBody({
    type: CreateEventDto,
    description: 'Structure du JSON pour sauvegarder une ressource',
  })
  createEvent(): null {
    return null;
  }
  @Post('/participate/:idEvent')
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiBody({ type: String })
  participateEvent(): null {
    return null;
  }
}
