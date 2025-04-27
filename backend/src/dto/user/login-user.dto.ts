import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: 'Email ou Username',
  })
  @IsNotEmpty({ message: "L'identifiant ne doit pas être vide" })
  @IsString({ message: "L'identifiant doit être une chaîne de caractères" })
  identifier: string;

  @ApiProperty({
    example: 'Complex9*4a#',
    description: "Le mot de passe de l'utilisateur",
  })
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  password: string;
}
