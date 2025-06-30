import { ApiProperty } from '@nestjs/swagger';

export class CreateEventRequestDto {
  @ApiProperty({
    example: 'Evènement de test',
    description: "Titre de l'évènement",
    required: true,
  })
  title: string;

  @ApiProperty({
    example: 'Motus',
    description: "Type de l'évènement",
    required: true,
  })
  type: number;

  @ApiProperty({
    example: true,
    description: 'Public ou Privé',
    required: true,
  })
  isRestricted: boolean;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Contenu de l’évènement',
    required: true,
  })
  content: string;
}
