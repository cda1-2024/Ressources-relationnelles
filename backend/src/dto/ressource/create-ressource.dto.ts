import { ApiProperty } from '@nestjs/swagger';

export class CreateRessourceDto {
  @ApiProperty({
    example: 'La fresque de la paix',
    description: 'Le titre de la ressource',
  })
  title: string;

  @ApiProperty({
    example: 'culpa qui officia deserunt mollit anim id est laborum.',
    description: 'Contenu de la ressource',
  })
  content_text: string;

  @ApiProperty({
    example: 'www.youtube.com/watch?v=123456',
    description: 'Contenu de la ressource',
  })
  content: string;

  @ApiProperty({
    example: 'Art',
    description: 'La catégorie de la ressource',
  })
  category: String;

  @ApiProperty({
    example: 'restricted',
    description: 'La visibilité de la ressource',
  })
  visibilty: String;

  @ApiProperty({
    example: 'draft',
    description: 'L\'état de la ressource',
  })
  state: String;

}
