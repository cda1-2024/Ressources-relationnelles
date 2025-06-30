import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PublishCommentDto {
  @ApiProperty({
    example: 'This is a comment on the post.',
    description: 'The content of the comment.',
  })
  @IsNotEmpty({ message: 'Le contenu du commentaire ne peut pas être vide' })
  @IsString({ message: 'Le contenu du commentaire doit être une chaîne de caractères' })
  message: string;

  @ApiProperty({
    example: '12345',
    description: 'The ID of the post to which the comment is associated.',
  })
  @IsNotEmpty({ message: "L'ID de la  ressource ne peut pas être vide" })
  @IsString({ message: "L'ID de la resssource doit être une chaîne de caractères" })
  ressourceId: string;

  @ApiProperty({
    example: '67890',
    description: 'The ID of the parent comment if this is a reply.',
    required: false,
  })
  @IsOptional()
  parentId?: string;
}
