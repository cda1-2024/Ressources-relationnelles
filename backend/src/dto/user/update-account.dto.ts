import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email: string;

  @ApiProperty({ example: 'Vnono', description: "Surnom de l'utilisateur" })
  username: string;

  @ApiProperty({
    example: 'http://image1-1',
    description: "Phtoto de profil de l'utilisateur",
  })
  profile_picture: string;

  @ApiProperty({
    example: 'I am user',
    description: "Le bio de l'utilisateur",
  })
  bio: string;
}
