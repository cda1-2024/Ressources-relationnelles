import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('api/comments/')
export class CommentController {
  @Post('/publish/:idRessource')
  publishComment(): null {
    return null;
  }

  @Delete('/:idComment')
  deleteComment(): null {
    return null;
  }

}
