import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ValidateRessourceRequestDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ 
    example: true,
    description: "Booleen pour valider ou non la ressource",
    required: true,
  })
  readonly validate: boolean;
}
