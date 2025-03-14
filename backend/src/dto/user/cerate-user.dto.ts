import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email: string;
  
  @ApiProperty({
    example: 'UU_BR1Z5B5Z16',
    description: "L'uuid utilisateur utilisaant un service de connexion tierce",
  })
  uuid: string;

  @ApiProperty({
    example: 'Google',
    description: "Le service de connexion tierce",
  })
  type_service: string;

  @ApiProperty({ example: 'Vnono', description: "Surnom de l'utilisateur" })
  username: string;

  @ApiProperty({
    example: 'Complex9*4a#',
    description: "Le mot de passe de l'utulisateur",
  })
  password: string;
}
