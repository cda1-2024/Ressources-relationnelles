import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, isString, MaxLength } from 'class-validator';
import { IsUsernameUnique } from 'src/validators/is_username_unique/is-username-unique.decorator';

export class updateMyAccountDto {
  @IsString()
  @IsOptional()
  @IsUsernameUnique()
  @IsNotEmpty({ message: "Le nom d'utilisateur ne doit pas être vide" })
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
  @IsOptional()
  @MaxLength(1000)
  @ApiProperty({
    example: 'I am user',
    description: "Le bio de l'utilisateur",
  })
  bio?: string;
}
