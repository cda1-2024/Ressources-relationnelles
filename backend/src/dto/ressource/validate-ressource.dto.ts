import { ApiProperty } from '@nestjs/swagger';

export class ValidateRessourceDto {
  @ApiProperty({ 
    example: true,
    description: "Booleen pour valider ou non la ressource",
    required: true,
  })
  readonly validate: boolean;
}
