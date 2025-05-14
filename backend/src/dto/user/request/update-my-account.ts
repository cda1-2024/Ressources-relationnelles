import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, isString } from 'class-validator';

export class updateMyAccount {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: "L'email de l'utilisateur",
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Vnono', description: "Surnom de l'utilisateur" })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'http://image1-1',
    description: "Phtoto de profil de l'utilisateur",
  })
  profile_piccture?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'I am user',
    description: "Le bio de l'utilisateur",
  })
  bio?: string;
}
