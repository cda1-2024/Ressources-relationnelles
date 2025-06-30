import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import { IsCategoryUnique } from 'src/validators/is_category_unique/is-category-unique.decorator';

export class CreateCategoryDto {
  @IsCategoryUnique()
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide.' })
  @ApiProperty({
    example: 'Politique',
    description: 'Le titre de la catégorie',
    required: true,
  })
  readonly name: string;

  @IsString({ message: 'La couleur doit être une chaîne de caractères.' })
  @IsHexColor({ message: 'La couleur doit être un code hexadécimal valide (ex: #FF5733).' })
  @IsNotEmpty({ message: 'La couleur ne peut pas être vide.' })
  @ApiProperty({
    example: '#FF5733',
    description: 'La couleur de la catégorie',
    required: true,
  })
  readonly color: string;

  @IsString({ message: 'L’icône doit être une chaîne de caractères.' })
  @ApiProperty({
    example: 'https://example.com/icon.png',
    description: 'URL de l’icône de la catégorie',
  })
  readonly icon: string;
}
