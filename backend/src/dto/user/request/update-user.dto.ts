import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max } from 'class-validator';
import { UserRole } from 'src/models/user.model';
import { IsUsernameUnique } from 'src/validators/is_username_unique/is-username-unique.decorator';

export class UpdateUserDto {
  @IsUsernameUnique()
  @IsOptional()
  @IsNotEmpty({ message: "Le nom d'utilisateur ne doit pas être vide" })
  @Matches(/^(?!^\d+$)(?!^[\W_]+$)[a-zA-Z0-9._-]{3,}$/, {
    message:
      "Le nom d'utilisateur doit contenir au moins 3 caractères, ne peut être composé uniquement de chiffres ou de caractères spéciaux, et peut inclure des lettres, des chiffres, des tirets (-), des underscores (_) ou des points (.)",
  })
  @ApiProperty({
    example: 'Vnono',
    description: "Surnom de l'utilisateur",
    required: false,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'http://image1-1',
    description: "Photo de profil de l'utilisateur",
    required: false,
  })
  profile_picture?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: "Statut de bannissement de l'utilisateur",
    required: false,
  })
  banned?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: "Statut de désactivation de l'utilisateur",
    required: false,
  })
  disabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Max(Object.keys(UserRole).length - 1, { message: 'Le rôle doit être un nombre entre 0 et 4' })
  @ApiProperty({
    example: 1,
    description: "Rôle de l'utilisateur",
    required: false,
  })
  role?: number;

  @ApiProperty({
    example: 'I am user',
    description: "Le bio de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
