import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Toto976',
    description: "Username de l'utilisateur",
  })
  username: string;

  @IsEmail()
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
