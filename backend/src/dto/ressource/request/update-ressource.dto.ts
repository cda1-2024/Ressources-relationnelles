import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRessourceRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'La fresque de la paix',
    description: 'Le titre de la ressource',
    required: false,
  })
  readonly title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'culpa qui officia deserunt mollit anim id est laborum.',
    description: 'Contenu de la ressource',
    required: false,
  })
  readonly content_text?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'www.youtube.com/watch?v=123456',
    description: 'Contenu de la ressource',
    required: false,
  })
  readonly content_link?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '57aa6c49-31b5-4152-af65-1e6b779dc772',
    description: 'La catégorie de la ressource',
    required: false,
  })
  readonly category?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'La visibilité de la ressource',
    required: false,
  })
  readonly visibility?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Le type de la ressource',
    required: false,
  })
  readonly status?: number;
}
