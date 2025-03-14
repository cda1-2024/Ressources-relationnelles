import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email: string;

  @ApiProperty({ example: 'Vnono', description: "Surnom de l'utilisateur" })
  username: string;

  @ApiProperty({ example: 'http://image1-1', description: "Photo de profil de l'utilisateur" })
  profile_picture: string;

  @ApiProperty({ example: false, description: "Statut de bannissement de l'utilisateur" })
  banned: boolean;

  @ApiProperty({ example: false, description: "Statut de désactivation de l'utilisateur" })
  disabled: boolean;

  @ApiProperty({ example: 'user', description: "Rôle de l'utilisateur" })
  role: 'user';

}
