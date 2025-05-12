import { ApiProperty } from '@nestjs/swagger';

export class UpdateRessourceDto {
  @ApiProperty({ 
    description: 'Exemple de titre mis à jour', 
    required: false 
  })
  readonly title?: string;

  @ApiProperty({ 
    description: 'Exemple texte mis à jour', 
    required: false 
  })
  readonly content_text?: string;

  @ApiProperty({
    description: 'Exemple de contenu mis à jour',
    required: false,
  })
  readonly content_link?: string;

  @ApiProperty({
    description: 'Exemple de catégorie mise à jour',
    required: false,
  })
  readonly category?: string;

  @ApiProperty({ 
    description: 'visibilité', 
    required: false 
  })
  readonly visibility?: Number;

  @ApiProperty({ 
    description: 'Status', 
    required: false 
  })
  readonly status?: Number;
}
