import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'Titre2',
    description: "Titre de l'évènement",
  })
  type: string;

  @ApiProperty({
    example: 1,
    description: 'Public ou Privé',
  })
  isRestricted: boolean;

}
