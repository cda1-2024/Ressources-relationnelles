import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  IDENTIFIER_NOT_EMPTY,
  IDENTIFIER_NOT_A_STRING,
  PASSWORD_NOT_EMPTY,
  PASSWORD_NOT_A_STRING,
} from 'src/helper/constants/user-constant-exception';

export class LoginUserDto {
  @ApiProperty({
    example: 'b.976@gmail.com',
    description: 'Email ou Username',
  })
  @IsNotEmpty({ message: IDENTIFIER_NOT_EMPTY })
  @IsString({ message: IDENTIFIER_NOT_A_STRING })
  identifier: string;

  @ApiProperty({
    example: 'Complex9*4a#',
    description: "Le mot de passe de l'utilisateur",
  })
  @IsNotEmpty({ message: PASSWORD_NOT_EMPTY })
  @IsString({ message: PASSWORD_NOT_A_STRING })
  password: string;
}
