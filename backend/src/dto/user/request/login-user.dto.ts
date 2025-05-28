import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/validators/helper_validator/helper-validator.decorator';

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

  @ApiProperty({
    example: true,
    description: 'Indique si l’utilisateur souhaite rester connecté',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  rememberMe?: boolean;
}
