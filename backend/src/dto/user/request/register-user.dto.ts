import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsEmailUnique } from 'src/validators/is_email_unique/is-email-unique.decorator';
import { IsUsernameUnique } from 'src/validators/is_username_unique/is-username-unique.decorator';

export class RegisterUserDto {
  @IsNotEmpty({ message: "L'email ne doit pas être vide" })
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  @IsEmailUnique()
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email: string;

  @IsNotEmpty({ message: "Le nom d'utilisateur ne doit pas être vide" })
  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères",
  })
  @Matches(/^(?!^\d+$)(?!^[\W_]+$)[a-zA-Z0-9._-]{3,}$/, {
    message:
      "Le nom d'utilisateur doit contenir au moins 3 caractères, ne peut être composé uniquement de chiffres ou de caractères spéciaux, et peut inclure des lettres, des chiffres, des tirets (-), des underscores (_) ou des points (.)",
  })
  @IsUsernameUnique()
  @ApiProperty({
    example: 'Toto976',
    description: "Username de l'utilisateur",
  })
  username: string;

  @Matches(/^[a-zA-Z0-9!@#$%^&*]{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins 8 caractères, y compris des lettres, des chiffres et des caractères spéciaux',
  })
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide' })
  @ApiProperty({
    example: 'Complex9*4a#',
    description: "Le mot de passe de l'utulisateur",
  })
  password: string;
}
