import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterEventRequestDto {
  @ApiProperty({
    example: 'La fresqu',
    description: 'Le champ de recherche',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly query?: string;

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
    description: "L'id de l'utilisateur qui a créé l'événement",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  readonly managerId?: string;

  @ApiProperty({
    example: 1,
    description: 'Le numéro de la page',
  })
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;

  @ApiProperty({
    example: 10,
    description: "Le nombre d'événements par page",
  })
  @IsOptional()
  @Type(() => Number)
  readonly pageSize: number = 10;
}
