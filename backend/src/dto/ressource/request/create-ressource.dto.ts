import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRessourceRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'La fresque de la paix',
    description: 'Le titre de la ressource',
    required: true,
  })
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'culpa qui officia deserunt mollit anim id est laborum.',
    description: 'Contenu de la ressource',
    required: false,
  })
  readonly content_text: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://monfichier.com/image.pdf',
    description: 'Lien vers un fichier externe',
    required: false,
  })
  content_link: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '57aa6c49-31b5-4152-af65-1e6b779dc772',
    description: 'La catégorie de la ressource',
    required: false,
  })
  readonly category?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 1,
    description: 'La visibilité de la ressource',
    required: true,
  })
  readonly visibility: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 1,
    description: 'Le type de la ressource',
    required: true,
  })
  readonly type: string;
}
