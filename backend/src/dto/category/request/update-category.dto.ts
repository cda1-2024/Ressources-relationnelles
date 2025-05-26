import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IsCategoryUnique } from 'src/validators/is_category_unique/is-category-unique.decorator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  @ApiProperty({
    example: 'Politique',
    description: 'Le titre de la catégorie',
    required: false,
  })
  @IsCategoryUnique()
  readonly name?: string;

  @IsString({ message: 'La couleur doit être une chaîne de caractères.' })
  @ApiProperty({
    example: '#FF5733',
    description: 'La couleur de la catégorie',
    required: false,
  })
  @IsOptional()
  readonly color?: string;

  @IsString({ message: 'L’icône doit être une chaîne de caractères.' })
  @ApiProperty({
    example: 'https://example.com/icon.png',
    description: 'URL de l’icône de la catégorie',
    required: false,
  })
  @IsOptional()
  readonly iconPath?: string;

  @IsBoolean({ message: 'Le champ deleted doit être un booléen.' })
  @ApiProperty({
    example: true,
    description: 'Indique si la catégorie est supprimée ou non',
    required: false,
  })
  @IsOptional()
  readonly deleted?: boolean;
}
