import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateMyAccountDto {
  @ApiProperty({ example: 'Vnono', description: "Surnom de l'utilisateur" })
  @IsNotEmpty({ message: "Le nom d'utilisateur ne doit pas être vide" })
  @Matches(/^(?!^\d+$)(?!^[\W_]+$)[a-zA-Z0-9._-]{3,}$/, {
    message:
      "Le nom d'utilisateur doit contenir au moins 3 caractères, ne peut être composé uniquement de chiffres ou de caractères spéciaux, et peut inclure des lettres, des chiffres, des tirets (-), des underscores (_) ou des points (.)",
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    example: 'http://image1-1',
    description: "Phtoto de profil de l'utilisateur",
  })
  @IsOptional()
  @IsString()
  profile_piccture: string;

  @ApiProperty({
    example: 'I am user',
    description: "Le bio de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  bio: string;
}
