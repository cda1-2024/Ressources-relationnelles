import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListUserRequestDto {
  @ApiProperty({
    example: '1',
    description: 'Le numéro de page',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly pageNumber?: string;

  @ApiProperty({
    example: '10',
    description: 'Le nombre d’éléments par page',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly pageSize?: string;

  @ApiProperty({
    example: 'john_doe',
    description: "Filtrer par nom d'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({
    example: 'true',
    description: 'Filtrer par statut "banni"',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly banned?: string;

  @ApiProperty({
    example: 'false',
    description: 'Filtrer par statut "désactivé"',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly disabled?: string;
}
