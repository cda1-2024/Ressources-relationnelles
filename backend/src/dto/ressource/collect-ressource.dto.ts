import { ApiProperty } from '@nestjs/swagger';

export class CollectRessourceDto {
  @ApiProperty({
    example: 'Bookmark',
    description: "Type de sauvegarde",
  })
  type: string;
}
