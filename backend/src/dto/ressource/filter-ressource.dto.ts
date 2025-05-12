import { ApiProperty } from '@nestjs/swagger';

export class FilterRessourceDto {
  @ApiProperty({
    example: 'La fresqu',
    description: 'Le champ de recherche',
    required: false,
  })
  readonly query_string?: string;

  @ApiProperty({
    example: 'f3393cc3-9e23-4f8c-8984-a4217a9127d0',
    description: 'L\'id de la catégorie recherchée',
    required: false,
  })
  readonly category?: string;

  @ApiProperty({
    example: 'text',
    description: 'Type recherché',
    required: false,
  })
  readonly type?: string;

  @ApiProperty({
    example: 'f5e3f135-e8c3-4008-b4f0-add664f16524',
    description: 'L\'id de l\'utilisateur qui a créé la ressource',
    required: false,
  })
  readonly creator_id?: string;

  @ApiProperty({
    example: 'f5e3f135-e8c3-4008-b4f0-add664f16524',
    description: 'L\'id de l\'utilisateur qui a créé la ressource',
    required: false,
  })
  readonly validator_id?: string;

  @ApiProperty({
    example: 1,
    description: 'Statut de la ressource',
    required: false,
  })
  readonly status?: number;

  @ApiProperty({
    example: 1,
    description: 'Le numéro de la page',
  })
  readonly page_number: number;

  @ApiProperty({
    example: 10,
    description: 'Le nombre de ressources par page',
  })
  readonly result_size: number;
}