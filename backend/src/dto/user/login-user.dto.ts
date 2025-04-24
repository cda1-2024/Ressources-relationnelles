import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: 'Email / Username',
  })
  identifier: string;

  @ApiProperty({
    example: 'Complex9*4a#',
    description: "Le mot de passe de l'utulisateur",
  })
  password: string;
}
