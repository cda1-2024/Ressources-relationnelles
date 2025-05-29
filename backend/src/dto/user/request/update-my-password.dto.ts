import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateMyPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ysdfghgdhf', description: "Ancien mot de passe de l'utilisateur" })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ysdfghgdhf',
    description: "Nouveau mot de passe de l'utilisateur",
  })
  newPassword: string;
}
