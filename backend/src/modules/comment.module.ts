import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from 'src/controller/comment.controller';
import { Comment } from 'src/models/comment.model';
import { CommentService } from 'src/services/comment/comment.service';
import { RessourceModule } from './ressource.module';

@Module({
  controllers: [CommentController],
  imports: [TypeOrmModule.forFeature([Comment]), RessourceModule],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
