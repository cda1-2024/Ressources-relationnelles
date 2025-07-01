import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PublishCommentDto } from 'src/dto/comment/request/publish-comment.dto';
import { CommentResponseDto, ListCommentResponseDto } from 'src/dto/comment/response/list-comment-response.dto';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';
import { Roles } from 'src/middleware/guards/roles.decorator';
import { RolesGuard } from 'src/middleware/guards/roles.guard';
import { User, UserRole } from 'src/models/user.model';
import { CommentMapper } from 'src/services/comment/comment.mapper';
import { CommentService } from 'src/services/comment/comment.service';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('ressources/:idRessource')
  @ApiParam({ name: 'idRessource', required: true, type: String })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async getAllCommentsByRessource(@Param('idRessource') idRessource: string): Promise<ListCommentResponseDto> {
    const comments = await this.commentService.getAllCommentsByRessource(idRessource);
    return CommentMapper.toResponseListDto(comments);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @ApiParam({ name: 'id', required: true, type: String })
  async getCommentById(@Param('id') idComment: string): Promise<CommentResponseDto> {
    const comment = await this.commentService.getCommentById(idComment);
    return CommentMapper.toResponseFullDto(comment);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async publishComment(
    @Body() publishComment: PublishCommentDto,
    @CurrentUser() user: User,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentService.publishComment(user, publishComment);
    return CommentMapper.toResponseFullDto(comment);
  }

  @Delete('/:idComment')
  @ApiParam({ name: 'id', required: true, type: String })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async deleteComment(@Param('idComment') idComment: string) {
    await this.commentService.deleteComment(idComment);
    return { message: 'Commentaire supprimé avec succès' };
  }
}
