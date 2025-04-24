import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email: string;

  @ApiProperty({
    example: 'Toto976',
    description: "Username de l'utilisateur",
  })
  username: string;

  @ApiProperty({
    example: 'Complex9*4a#',
    description: "Le mot de passe de l'utulisateur",
  })
  password: string;
}
