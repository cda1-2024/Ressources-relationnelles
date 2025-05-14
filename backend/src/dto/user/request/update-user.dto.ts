import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({
    example: 'Vnono',
    description: "Surnom de l'utilisateur",
    required: false,
  })
  username?: string;

  @IsOptional()
  @ApiProperty({
    example: 'http://image1-1',
    description: "Photo de profil de l'utilisateur",
    required: false,
  })
  profile_picture?: string;

  @IsOptional()
  @ApiProperty({
    example: false,
    description: "Statut de bannissement de l'utilisateur",
    required: false,
  })
  banned?: boolean;

  @IsOptional()
  @ApiProperty({
    example: false,
    description: "Statut de désactivation de l'utilisateur",
    required: false,
  })
  disabled?: boolean;

  @IsOptional()
  @ApiProperty({
    example: 'user',
    description: "Rôle de l'utilisateur",
    required: false,
  })
  role?: number;
}
