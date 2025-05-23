import { Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
