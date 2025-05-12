import { ApiProperty } from '@nestjs/swagger';

export class CreateRessourceDto {
  @ApiProperty({
    example: 'La fresque de la paix',
    description: 'Le titre de la ressource',
    required: true,
  })
  readonly title: string;

  @ApiProperty({
    example: 'culpa qui officia deserunt mollit anim id est laborum.',
    description: 'Contenu de la ressource',
    required: true,
  })
  readonly content_text: string;

  @ApiProperty({
    example: 'www.youtube.com/watch?v=123456',
    description: 'Contenu de la ressource',
    required: false,
  })
  readonly content_link?: string;

  @ApiProperty({
    example: "57aa6c49-31b5-4152-af65-1e6b779dc772",
    description: 'La catégorie de la ressource',
    required: false,
  })
  readonly category?: string;

  @ApiProperty({
    example: 1,
    description: 'La visibilité de la ressource',
  })
  readonly visibilty: number;

  @ApiProperty({
    example: 1,
    description: 'Le type de la ressource',
  })
  readonly type: number;
}
