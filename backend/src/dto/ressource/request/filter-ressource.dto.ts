import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsInt } from 'class-validator';

export class FilterRessourceRequestDto {
  @ApiProperty({
    example: 'La fresqu',
    description: 'Le champ de recherche',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly query?: string;

  @ApiProperty({
    example: 'f3393cc3-9e23-4f8c-8984-a4217a9127d0',
    description: "L'id de la catégorie recherchée",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  readonly categoryId?: string;

  @ApiProperty({
    example: 'text',
    description: 'Type recherché',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly type?: string;

  @ApiProperty({
    example: 'f5e3f135-e8c3-4008-b4f0-add664f16524',
    description: "L'id de l'utilisateur qui a créé la ressource",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  readonly creatorId?: string;

  @ApiProperty({
    example: 'f5e3f135-e8c3-4008-b4f0-add664f16524',
    description: "L'id de l'utilisateur qui a validé la ressource",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  readonly validatorId?: string;

  @ApiProperty({
    example: 1,
    description: 'Statut de la ressource',
    required: false,
  })
  @IsOptional()
  @IsInt()
  readonly status?: number;

  @ApiProperty({
    example: 1,
    description: 'Le numéro de la page',
  })
  @IsOptional()
  @IsInt()
  readonly page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Le nombre de ressources par page',
  })
  @IsOptional()
  @IsInt()
  readonly pageSize: number = 10;
}
